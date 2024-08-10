output "instance_ids" {
  value = aws_instance.graphql_instance[*].id
}

output "public_ips" {
  value = aws_eip.server_elastic_ip.public_ip
}
