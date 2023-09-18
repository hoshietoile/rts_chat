defmodule RtsWeb.UserStore do
  @key "user"

  def conn() do
    {:ok, conn} = Redix.start_link(host: "store", port: 6379)
    conn
  end

  def add(%{"name" => user_name} = payload) do
    conn = conn()
    {:ok, result} = Jason.encode(payload)
    {:ok, res} = Redix.command(conn, ["XADD", @key, "*", "data", result])
  end

  def find(%{"id" => user_id} = payload) do
    conn = conn()
  end
end
