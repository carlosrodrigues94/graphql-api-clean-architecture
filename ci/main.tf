
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

# 3) Create Route Table
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

# 4) Create Subnet
resource "aws_subnet" "graphql_server_instance_subnet" {
  vpc_id            = aws_vpc.graphql_server_instance_vpc.id
  cidr_block        = "10.0.0.0/24"
  availability_zone = "us-east-1a"
  depends_on        = [aws_internet_gateway.graphql_server_internet_gw]

  tags = {
    Name = "graphql_server_instance_subnet"
  }
}

# 5) Associate Subnet with Route Table
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

# 7) Assign ENI with IP
resource "aws_network_interface" "graphql_server_network_i" {
  subnet_id       = aws_subnet.graphql_server_instance_subnet.id
  private_ips     = ["10.0.0.10"]
  security_groups = [aws_security_group.graphql_instance_sg.id]
}

# resource "aws_instance" "graphql_server_instance" {
#   depends_on             = [aws_vpc.graphql_server_instance_vpc]
#   key_name               = aws_key_pair.deployer.key_name
#   ami                    = data.aws_ami.ubuntu.id
#   count                  = 1
#   instance_type          = "t2.micro"
#   vpc_security_group_ids = [aws_security_group.graphql_instance_sg.id]
#   subnet_id              = aws_subnet.graphql_server_instance_subnet.id

#   tags = {
#     Name = "graphql_server_instance_${count.index}"
#   }
# }




# 8) Assign Elastic IP to ENI
resource "aws_eip" "server_elastic_ip" {
  vpc                       = true
  network_interface         = aws_network_interface.graphql_server_network_i.id
  associate_with_private_ip = "10.0.0.10"
  depends_on                = [aws_internet_gateway.graphql_server_internet_gw, aws_instance.graphql_instance]

  tags = {
    Name = "EIP_A"
  }
}



# 10) Create Linux Server and Install/Enable Apache2
resource "aws_instance" "graphql_instance" {
  ami               = "ami-0947d2ba12ee1ff75"
  instance_type     = "t2.micro"
  availability_zone = "us-east-1a"
  key_name          = aws_key_pair.deployer.key_name
  # iam_instance_profile = "${aws_iam_instance_profile.EC2-S3_Profile.name}"

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.graphql_server_network_i.id
  }

  # user_data = <<-EOF
  #   #!/bin/bash
  #   sudo yum update -y
  #   sudo yum install -y httpd.x86_64
  #   sudo systemctl start httpd.service
  #   sudo systemctl enable httpd.service
  #   sudo aws s3 sync s3://awsbucketbeta00/website /var/www/html 
  # EOF

  tags = {
    Name = "graphql_instance"
  }
}

data "aws_caller_identity" "current" {}

resource "aws_ecr_repository" "repository" {
  name = var.repository_name
}








