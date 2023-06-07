FROM python:alpine

RUN apk --update --no-cache add gcc musl-dev openjdk17-jdk curl graphviz ttf-dejavu fontconfig
RUN pip install --upgrade pip
RUN pip install mkdocs mkdocs-kroki-plugin mkdocs-material mkdocs-git-revision-date-localized-plugin

WORKDIR /content

ENTRYPOINT [ "mkdocs" ]
