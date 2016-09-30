build-development:
	npm install
	bower install
	gulp


build-production:
	bower install
	gulp --cdn http://60.205.169.84
	scp -r dist/*  root@60.205.169.84:/static/website
