FROM debian:12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
  bash \
  ca-certificates \
  curl \
  git \
  procps \
  python3 \
  python3-venv \
  ripgrep \
  tini \
  && rm -rf /var/lib/apt/lists/*

RUN useradd -m -s /bin/bash agent \
  && mkdir -p /home/agent/work \
  && chown -R agent:agent /home/agent

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /home/agent/work
USER agent

ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/entrypoint.sh"]
