defmodule RtsWeb.Chat do
  @key "chat"

  def conn() do
    # TODO: Have to configure as different host when deploy
    {:ok, conn} = Redix.start_link(host: "store", port: 6379)
    conn
  end

  def add(%{"content" => content, "created_at" => created_at}) do
    conn = conn()
    {:ok, res} = Redix.command(conn, ["ZADD", @key, created_at, content])
  end

  def list() do
    conn = conn()
    {:ok, res} = Redix.command(conn, ["ZRANGE", @key, 0, -1, "WITHSCORES"])

    res
    |> Enum.chunk_every(2)
    |> Enum.with_index(1)
    |> Enum.map(fn {[content, created_at], index}
      -> %{content: content, created_at: created_at, index: index} end)
  end
end
