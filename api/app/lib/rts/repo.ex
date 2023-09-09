defmodule Rts.Repo do
  use Ecto.Repo,
    otp_app: :rts,
    adapter: Ecto.Adapters.Postgres
end
