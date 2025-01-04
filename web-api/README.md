# prisma

## prisma 配下に関して

prisma 配下は ORMとしてprismaを用いたTodoアプリを想定したGraphQLの資材を格納している

## 環境構築

1\. DB 起動

```
docker compose up -d
```

2\. DB初期化

```
pnpm db:init
```

3\. 型生成

```
pnpm gen
```

## 起動方法

以下を実行すると サーバ起動 できる

```
pnpm dev
```

## テスト実行方法

以下を実行すると テスト できる

```
pnpm test
```
