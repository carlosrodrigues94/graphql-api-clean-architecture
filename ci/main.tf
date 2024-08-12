
provider "aws" {
  region     = var.aws_region
  access_key = var.aws_iam_access_key
  secret_key = var.aws_iam_secret_key
}

terraform {

  backend "s3" {
    bucket         = "terraform.data"
    key            = "terraform.tfstate"
    dynamodb_table = "terraform_lock"
    region         = "us-east-1"
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_key_pair" "deployer" {
  key_name   = "terraform-aws-ec2-key"
  public_key = var.ssh_ec2_public_key
}

resource "aws_vpc" "graphql_server_instance_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "graphql_server_instance_vpc"
  }
}

# 2) Create Internet Gateway
resource "aws_internet_gateway" "graphql_server_internet_gw" {
  vpc_id = aws_vpc.graphql_server_instance_vpc.id

  tags = {
    Name = "graphql_server_internet_gw"
  }
}

resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "db_subnet_group"
  subnet_ids = [aws_subnet.graphql_server_instance_subnet.id, aws_subnet.graphql_server_instance_subnet_b.id]

  tags = {
    Name = "db_subnet_group"
  }
}

resource "aws_db_parameter_group" "db_parameter_group" {
  name   = "db-parameter-group"
  family = "postgres14"


  parameter {
    name         = "max_connections"
    value        = "100"
    apply_method = "pending-reboot"
  }

  tags = {
    Name = "db_parameter_group"
  }
}

resource "aws_db_instance" "graphql_postgres" {
  identifier           = "graphql-server-postgres"
  engine               = "postgres"
  engine_version       = 14
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  storage_type         = "gp2"
  username             = var.db_user
  password             = var.db_password
  parameter_group_name = aws_db_parameter_group.db_parameter_group.name
  skip_final_snapshot  = true

  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name

  tags = {
    Name = "graphql_postgres"
  }
}


resource "aws_route_table" "graphql_server_route_table" {
  vpc_id = aws_vpc.graphql_server_instance_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.graphql_server_internet_gw.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.graphql_server_internet_gw.id
  }

  tags = {
    Name = "graphql_server_route_table"
  }
}

resource "aws_subnet" "graphql_server_instance_subnet" {
  vpc_id            = aws_vpc.graphql_server_instance_vpc.id
  cidr_block        = "10.0.0.0/24" # Based on VPC Range
  availability_zone = "us-east-1a"
  depends_on        = [aws_internet_gateway.graphql_server_internet_gw]

  tags = {
    Name = "graphql_server_instance_subnet"
  }
}

resource "aws_subnet" "graphql_server_instance_subnet_b" {
  vpc_id                  = aws_vpc.graphql_server_instance_vpc.id
  cidr_block              = "10.0.1.0/24" # Based on VPC Range
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "graphql_server_instance_subnet_b"
  }
}


resource "aws_route_table_association" "graphql_route_table_association" {
  subnet_id      = aws_subnet.graphql_server_instance_subnet.id
  route_table_id = aws_route_table.graphql_server_route_table.id
}


resource "aws_security_group" "graphql_instance_sg" {
  name        = "graphql_instance_sg"
  description = "Allow SSH, HTTP, HTTPS inbound traffic"
  vpc_id      = aws_vpc.graphql_server_instance_vpc.id

  ingress {
    description = "HTTPS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP from VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH from VPC"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "graphql_instance_sg"
  }

}

resource "aws_security_group" "rds_sg" {
  name        = "rds_sg"
  description = "Allow inbound traffic from EC2 instance on port 5432"
  vpc_id      = aws_vpc.graphql_server_instance_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.graphql_instance_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "rds_sg"
  }
}

resource "aws_network_interface" "graphql_server_network_i" {
  subnet_id       = aws_subnet.graphql_server_instance_subnet.id
  private_ips     = ["10.0.0.10"]
  security_groups = [aws_security_group.graphql_instance_sg.id]
}

resource "aws_eip" "server_elastic_ip" {
  network_interface         = aws_network_interface.graphql_server_network_i.id
  associate_with_private_ip = "10.0.0.10"
  depends_on                = [aws_internet_gateway.graphql_server_internet_gw, aws_instance.graphql_instance]

  tags = {
    Name = "EIP_A"
  }
}


resource "aws_iam_role" "ec2_role" {
  name = "ec2_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_role_attachment" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}


resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "ec2_instance_profile"
  role = aws_iam_role.ec2_role.name
}


resource "aws_instance" "graphql_instance" {
  ami                  = "ami-0947d2ba12ee1ff75"
  instance_type        = "t2.micro"
  availability_zone    = "us-east-1a"
  key_name             = aws_key_pair.deployer.key_name
  iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.graphql_server_network_i.id
  }

  user_data = <<-EOF
    #!/bin/bash
    sudo amazon-linux-extras install docker
    sudo service docker start
    sudo usermod -a -G docker ec2-user
  EOF


  tags = {
    Name = "graphql_instance"
  }
}

data "aws_caller_identity" "current" {}

resource "aws_ecr_repository" "repository" {
  name         = var.repository_name
  force_delete = true
}








