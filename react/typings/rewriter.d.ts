interface QueryInternal {
  internal: {
    routes: [RoutesByBinding]
  }
}

interface RoutesByBinding {
  binding: string
  route: string
}
