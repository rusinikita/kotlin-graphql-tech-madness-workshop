It shows implementation of simple graphql server in few stacks.
Node.js: JS, TypeScript, Kotlin
JVM: Java, Scala, Kotlin

Исходники воркшопа. Цель - ознакомиться с graphql и несколькими технологическими стеками:

- java
- kotlin jvm
- javascript
- typescript
- kotlin node

Презентация - [ссылка](https://docs.google.com/presentation/d/1xUeiO4_LG3m2ePiuua29Oku5gi5n4tieuq20Mt-0qjc/edit?usp=sharing)

Руководство для старта graphql на JS
Руководство для старта graphql на Java

# Старт:
- Установить JDK. Рекомендую через [SDKman](https://sdkman.io/jdks#jdk.java.net)

На widows устанавливать мануально или через Cygwin

```
curl -s "https://get.sdkman.io" | bash

В новом окне
sdk install java
```

- Установить npm. Рекомендую сделать это через nvm [mac, linux, win/cygwin](https://github.com/nvm-sh/nvm#installation-and-update), [win exe](https://github.com/coreybutler/nvm-windows#installation--upgrades)

На widows устанавливать мануально или через Cygwin

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

В новом окне
nvm install node
```

- Клонировать репозиторий
- Зайти в папку node. Выполнить команду npm i. Выполнить команду `npm run run-kt`
- Зайти в jvm. Выполнить команду `./gradlew kotlin:boot-run`

# План воркшопа:

### Вводная

- Зачем мы тут, чего ожидать - 2m
- Теорчасть graphql - 5m
- еорчасть о платформах, их преимущества - 5m
- JS, npm - 5m 3 оружия Java инквизиции (пробуем угадать): медленно, не типизировано, библиотеки на каждый чих (низкая инженерная культура)
- Java, gradle - 5m 3 оружия JS инквизиции: долго компилируется, медленно пишите, говно мамонта
- Typescript - 2m
- Kotlin - 5m

### Практика

- Смотрим заготовку проекта
    - Общая схема
    - node: скрипты автоматизации
    - jvm: gradle многомодульность
- Пишем схему базы пользователя
- Пишем получения статуса и подписки
- Пишем "изменение" имени пользователя
- Пишем получение разрешений
- Показываю преимущество Kotlin для dsl. Рефакторим java/Provider
- Показываю преимущество типизации Kotlin. Добавляем новый permission
