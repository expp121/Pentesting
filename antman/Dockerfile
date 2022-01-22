FROM ubuntu:18.04

# Allow automated installation of packages
ENV DEBIAN_FRONTEND=noninteractive

# Do not update initramfs (initramfs-tools)
ENV INITRD NO

# Install Apache server, OpenJDK 8, and cron
RUN apt-get update && apt-get install -y supervisor apache2 openjdk-8-jdk cron vim net-tools

# Create tomcat user with group tomcat and home /opt/tomcat
RUN groupadd tomcat
RUN useradd -s /bin/false -g tomcat -d /opt/tomcat tomcat

# Install Tomcat 8 server
COPY files/apache-tomcat-8.5.16.tar.gz /tmp/tomcat.tar.gz
RUN cd /tmp && tar xvfz tomcat.tar.gz
RUN mkdir /opt/tomcat
RUN cp -Rv /tmp/apache-tomcat-8.5.16/* /opt/tomcat/
RUN rm -R /tmp/apache-tomcat-8.5.16
RUN rm -R /tmp/tomcat.tar.gz

# Permissions for Tomcat
RUN chgrp -R tomcat /opt/tomcat
RUN chmod -R g+r /opt/tomcat/conf
RUN chmod -R g+x /opt/tomcat/conf
RUN chown -R tomcat:tomcat /opt/tomcat/webapps /opt/tomcat/work /opt/tomcat/temp /opt/tomcat/logs

# Add Apache2 web content
Add files/webcontent.tgz /var/www/html/
RUN chown -R www-data:www-data /var/www/html

# Create additional directories owned by tomcat user for cron job script
RUN mkdir /opt/admin
RUN mkdir /opt/admin/logs
RUN chown -R tomcat:tomcat /opt/admin
RUN chmod -R 0755 /opt/admin

# Add delete-logs script for cron job
COPY files/delete-logs.sh /opt/admin
RUN chown tomcat:tomcat /opt/admin/delete-logs.sh
RUN chmod 0755 /opt/admin/delete-logs.sh

# Create cron job for the delete-logs script
RUN mkdir /var/log/cron
RUN echo "*/2 * * * * /opt/admin/delete-logs.sh >> /var/log/cron/delete-logs 2>&1" | crontab -

# Add flags
COPY files/flag_4_antman.txt /
COPY files/flag.txt /root/

# Tomcat 8 server variables
ENV JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64/jre
ENV CATALINA_PID=/opt/tomcat/temp/tomcat.pid
ENV CATALINA_HOME=/opt/tomcat
ENV CATALINA_BASE=/opt/tomcat
ENV CATALINA_OPTS='-Xms512M -Xmx1024M -server'
ENV JAVA_OPTS='-Djava.awt.headless=true -XX:+UseConcMarkSweepGC -Xdebug -Xrunjdwp:transport=dt_socket,address=4141,server=y,suspend=n'

# Apache server variables
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
ENV APACHE_RUN_USER=www-data
ENV APACHE_RUN_GROUP=www-data
ENV APACHE_LOG_DIR=/var/log/apache2
ENV APACHE_LOCK_DIR=/var/lock/apache2
ENV APACHE_PID_FILE=/var/run/apache2.pid
ENV APACHE_RUN_DIR=/var/run/apache2

# Configuration for supervisor controlling processes apache2, tomcat and cron
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf


EXPOSE 80 8080 4141
CMD /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf

