plugins {
    java
    id("org.springframework.boot") version "2.1.8.RELEASE"
    id("io.spring.dependency-management") version "1.0.8.RELEASE"
}

tasks.processResources {
    from("$rootDir/../schema.graphql")
}

dependencies {
    implementation("com.graphql-java:graphql-java:11.0")
    implementation("com.graphql-java:graphql-java-spring-boot-starter-webmvc:1.0")
    implementation("com.google.guava:guava:26.0-jre")
    implementation("org.springframework.boot:spring-boot-starter-web")

    runtime("com.graphql-java-kickstart:playground-spring-boot-starter:5.10.0")
}