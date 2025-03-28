echo 'Determining version number for publication'
echo 'Looking for an existing release tag against this commit'

VERSION=$(git describe --tags --match release/* --exact-match 2>&1)
if [ $? -ne 0 ]
then
  LAST=$(git describe --tags --match release/* 2>&1)
  if [ $? -ne 0 ]
  then
    echo 'No release tags found at all; bail out'
    exit 1
  fi

  echo "No matching tag found. Push a tag like release/1.0.1 against HEAD in order to release.  Most recent tag is: ${LAST}"
  exit 0
fi

VERSION=$(echo $VERSION | sed 's#release/##g')
echo "Publishing version: ${VERSION}"

status=$(curl -s --head -w %{http_code} -o /dev/null  https://www.npmjs.com/package/@dalet-oss/lexorank/v/${VERSION}/)
if [ $status -eq 200 ]
then
  echo 'Version already available on the NPM Registry.  This must be a rebuild; nothing to do here.'
else
  echo 'Version not already available on the NPM Registry'

  echo 'Setting the version into package.json'
  yarn version --no-git-tag-version --new-version ${VERSION}

  echo 'Adding NPM registry access token for https://registry.npmjs.org into local .npmrc'
  echo "//registry.npmjs.org/:_authToken=${NPM_REGISTRY_ACCESS_TOKEN}" >> .npmrc

  echo 'Publishing to NPM Central'
  npm publish --access public
fi
