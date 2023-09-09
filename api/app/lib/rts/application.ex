defmodule Rts.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      RtsWeb.Telemetry,
      # Start the Ecto repository
      Rts.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: Rts.PubSub},
      # Start Finch
      {Finch, name: Rts.Finch},
      # Start the Endpoint (http/https)
      RtsWeb.Endpoint
      # Start a worker by calling: Rts.Worker.start_link(arg)
      # {Rts.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Rts.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    RtsWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
