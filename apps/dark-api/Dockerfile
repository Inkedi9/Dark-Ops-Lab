FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o dark-api ./cmd/server

FROM alpine:3.20
WORKDIR /app
COPY --from=builder /app/dark-api .
# challenges.json must be mounted at runtime — never baked into the image
EXPOSE 8080
CMD ["./dark-api"]
