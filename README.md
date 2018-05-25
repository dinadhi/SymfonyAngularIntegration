
The Sample app is for product add,edit,list and delete. When you will run AngularFront it will show menu. Under Product tab you can find option to create/add/edit/delete. The api's will be serve by SymfonyApi. 

# How to run SymfonyAPi
-------------
1. run: composer install

2. run: app/console doc:data:create (if not run: chmod +x app/console)

3. run: app/console doctrine:schema:update --force

4. run: app/console ser:run 

5. check: http://127.0.0.1:8000 




# How to run AngularFront
-------------

0. install nodejs

1. run: npm i -g gulp && npm i -g bower

2. run: npm install && bower install (or bower install --allow-root)

3. run: gulp dev

4. Check http://127.0.0.1:3000



