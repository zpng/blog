build:
	npm install
	bower install


build-production:
	npm install
	bower install
	scp -r app/  root@60.205.169.84:/static/website
