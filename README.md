# main-client-electron

## stylus (main-mockからの置換)
```
[検索]
url\(\.\.\/images\/(.+\.(svg|png))\)

[置換]
url('~@/assets/images/$1')

[検索]
url\(\.\/\.\.\/\.\.\/dest\/images\/(.+\.(svg|png))\)

[置換]
url('~@/assets/images/$1')
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
