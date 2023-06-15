# community of practice template

This repository is a template for starting a community of practice and accompanying documentation. 

## up and running

To start using this template for your own playbooks and communities:

* [Fork this repository](https://github.com/acodeninja/community-of-practice-template/fork)
* Delete the file `.github/workflows/publish-docker.yml`
* If you want to add tracking
  * create a Google Analytics property
  * create a [repository secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) 
    `GOOGLE_ANALYTICS_TAG` to the tag value
* Customise the look and feel
  * Replace `overrides/assets/images/logo.svg` with your own logo
  * Replace `overrides/assets/images/favicon.png` with your own favicon
  * Update the stylesheet `overrides/assets/stylesheets/theme.css` to match your branding
* Tidy up the template
  * Delete `docs/kitchen-sink.md` to remove the demo page
  * Edit `docs/index.md` to remove the "work in progress" banner.
* Run locally to see your changes `make dev` (you'll need [docker](https://docs.docker.com/engine/install/) installed)

Refer to the [kitchen sink](https://acodeninja.github.io/community-of-practice-template/kitchen-sink/) to understand the
components and features available.
