set -e
npm run build
npm run generate
cd dist
echo 'demo.authtrail.com' > CNAME
git init
git add -A
git commit -m "Deploy demo"
git push -f git@github.com:AuthTrail/demo master:gh-pages
cd -
echo 'Deployment complete to: https://demo.authtrail.com'