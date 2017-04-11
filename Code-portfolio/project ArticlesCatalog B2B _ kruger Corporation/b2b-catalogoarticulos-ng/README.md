##b2b-catalogoArticulos
Proyecto de catalogo de articulos para el proyecto b2b

###Instalacion

###Requisitos
node: v4.x.x o superior
npm: v3.x.x

####Instalacion previa opcional pero recomendada.

```
npm install -g npm
npm install -g node-gyp
npm install -g node-pre-gyp
```

####Herramientas Prerequisito

```
npm install -g gulp
npm install -g jspm
```

###Registro a los repositorios locales para npm

```
npm set registry http://10.190.6.35:8081/repository/npm-all/
```

####Registro repositorio para jspm

```
jspm registry config npm ---> Ingresar: http://10.190.6.35:8081/repository/npm-org/
jspm registry create knpm jspm-npm  ---> Ingresar: http://10.190.6.35:8081/repository/npm-internal
```

####Instalacion de dependencias

En la carpeta raíz del proyecto

```
npm install
jspm install
```
