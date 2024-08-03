
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

resource "aws_security_group" "sg_8080" {
  name = "terraform-learn-state-sg-8080"
  ingress {
    from_port   = "8080"
    to_port     = "8080"
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  // connectivity to ubuntu mirrors is required to run `apt-get update` and `apt-get install apache2`
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "graphql_server_instance" {
  ami                    = data.aws_ami.ubuntu.id
  count                  = 1
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.sg_8080.id]
  user_data              = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y apache2
              sed -i -e 's/80/8080/' /etc/apache2/ports.conf
              echo "Hello World" > /var/www/html/index.html
              systemctl restart apache2
              EOF
  tags = {
    Name = "graphql_server_instance_${count.index}"
  }
}

output "instance_ids" {
  value = aws_instance.graphql_server_instance[*].id
}

output "public_ips" {
  value = aws_instance.graphql_server_instance[*].public_ip
}

variable "aws_region" {
  description = "The AWS region to create resources in"
  default     = "us-east-1"

}

variable "aws_iam_secret_key" {
  type      = string
  sensitive = true
}

variable "aws_iam_access_key" {
  type      = string
  sensitive = true
}

