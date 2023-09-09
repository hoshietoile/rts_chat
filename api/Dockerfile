FROM    elixir:1.15.4-alpine
RUN     apk update && apk add \
        inotify-tools git build-base npm bash
RUN     mix do local.hex --force, local.rebar --force, archive.install --force hex phx_new
WORKDIR /app