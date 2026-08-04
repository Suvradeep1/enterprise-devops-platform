# ADR-001 Repository Architecture

## Status

Accepted

## Context

This project is an enterprise DevOps learning platform built around a PERN Store application.

## Decision

- Monorepo
- GitHub Flow with protected branches
- Docker Hub as the first container registry
- Amazon ECR as the production registry
- Jenkins as the CI/CD engine
- ECS as the container orchestrator
- Route 53 for DNS
- Terraform for Infrastructure as Code

## Consequences

The platform will mimic a production-grade DevOps workflow while remaining cost-effective and educational.