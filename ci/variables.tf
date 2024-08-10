variable "repository_name" {
  type        = string
  description = "repository_name"
}

variable "ssh_ec2_public_key" {
  type      = string
  sensitive = true
}
variable "aws_iam_secret_key" {
  type      = string
  sensitive = true
}

variable "aws_iam_access_key" {
  type      = string
  sensitive = true
}

variable "aws_region" {
  description = "The AWS region to create resources in"
  default     = "us-east-1"

}

