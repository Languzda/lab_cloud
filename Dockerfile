FROM python:3.12-alpine
RUN mkdir /app
WORKDIR /app
COPY API /app
RUN pip install -r requirements.txt
RUN chmod +x /app/run.sh
CMD ["./run.sh"]