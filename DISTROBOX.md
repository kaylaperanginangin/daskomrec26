# Using Distrobox

If you want to use it inside a distrobox container, here are the step required to setup stuff 
`"Using arch container because i'm more familiar to it" -VIM`

1. Create the distrobox container

```sh
distrobox create\
    -n webdev-daskomrec26\
    -i docker.io/library/archlinux:latest\
    -I\
    -a "composer php mariadb npm nodejs eza starship systemd neovim"
```

2. Go inside the container

```sh
distrobox enter webdev-daskomrec26
```

3. Create the mysql database

Before creating the database, you have to uncomment these lines on `/etc/php/php.ini`:

```ini
extension=mysqli
extension=pdo_mysql
```

After that, run this:

```sh
sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
```

```sh
sudo chown -R mysql:mysql /var/lib/mysql
```

```sh
sudo systemctl start mariadb
```

```sh
sudo mariadb
```

Inside the mariadb REPL:

```sh
CREATE DATABASE daskomrec26;
CREATE USER 'laravel'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON daskomrec26.* TO 'laravel'@'localhost';
FLUSH PRIVILEGES;
```

Then, change this lines on the `.env` file:

```config
DB_USERNAME=laravel
DB_PASSWORD=password
```

Then, run these php command:

```sh
php artisan config:clear
php artisan migrate
```

4. Install the packages

```sh
composer install
npm install
```

5. Run the server!

```sh
composer run dev
```

Now, you can access the website on `localhost:8000`
