define redis::service(
    $port = '6379'
  , $config_bind = '0.0.0.0'
  , $config_loglevel = 'notice'
  , $config_timeout = '300'
  , $ensure = 'running'
) { 

  exec { "setup-redis-path":
    command => "/bin/echo 'export PATH=/opt/redis/bin:\$PATH' >> /home/vagrant/.profile",
    unless  => "/bin/grep -q /opt/redis/bin /home/vagrant/.profile ; /usr/bin/test $? -eq 0"
  }
  file { 'redis_config': 
      ensure    => file
    , path      => "/opt/redis/redis_${port}.conf"
    , content   => template("${module_name}/redis.conf.erb")
    , require   => Class['redis']
  }

  file { 'redis_logfile':
      ensure    => file
    , path      => "/var/log/redis-${port}.log"
    , require   => Class['redis']
    , group     => 'redis'
    , owner     => 'redis'
  }

  file { 'redis_upstart': 
      ensure    => file
    , path      => "/etc/init/redis-server-${port}.conf"
    , content   => template("${module_name}/redis.upstart.erb")
    , require   => Class['redis']
  }
  file { 'redis_dump.rdb':
      ensure  => present,
      owner => redis,
      group => redis,
      mode    => '0660',
      source  => "puppet:///files/dump.rdb",
      path      => "/opt/redis/redis_dump.rdb",
      #require    => Package['redis-server'],
     require   => File['redis_upstart']
  }
  file { "/etc/init.d/redis-server-${port}": 
      ensure    => link
    , target    => "/lib/init/upstart-job"
    , require   => File['redis_dump.rdb']
  }

  service { "redis-server-${port}":
      ensure    => $ensure
    , provider  => 'upstart'
    , require   => [  Class['redis']
                    , File['redis_upstart']
                    , File["/etc/init.d/redis-server-${port}"]
                    , File['redis_logfile'] ]
    , subscribe => File["/etc/init.d/redis-server-${port}"]
  }

}
# file { "/etc/redis/redis.conf":
#     ensure  => present,
#     mode    => '0644',
#     source  => "puppet:///files/redis.conf",
# #    notify => Service['redis-server'],
#     require    => Package['redis-server'],
# }
# file { "/var/lib/redis/dump.rdb":
#     ensure  => present,
#     owner => redis,
#     group => redis,
#     mode    => '0660',
#     source  => "puppet:///files/dump.rdb",
#     notify => Service['redis-server'],
#     #require    => Package['redis-server'],
#     require => File["/etc/redis/redis.conf"]
# }