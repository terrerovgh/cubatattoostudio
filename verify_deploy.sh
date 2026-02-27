echo "Waiting for Cloudflare Pages deployment..."
for i in {1..15}; do
  if curl -s https://cubatattoostudio.com | grep -q "dune-layer-1"; then
    echo "Deployment verified successfully on cubatattoostudio.com!"
    exit 0
  fi
  sleep 10
done
echo "Deployment verification timed out."
exit 1
