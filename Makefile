.PHONY: run backend frontend up-infra

run: up-infra
	make -j2 backend frontend

backend:
	cd ./backend && npm run start:dev

frontend:
	cd ./frontend && npm run dev

up-infra:
	cd ./backend && docker-compose ps | findstr /C:"Up" || (docker-compose up -d)

up-infra-l:
	cd ./backend && docker-compose ps | grep -q "Up" || (docker-compose up -d)

deploy: deploy-front deploy-back

deploy-front:
	git push -f dokku-front master

deploy-back:
	git push -f dokku-back master