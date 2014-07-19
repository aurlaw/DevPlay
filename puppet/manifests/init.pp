    file { "/opt/node":
        ensure  => "link",
        target  => "/vagrant",
        force   => true,
    }

exec { 'apt-get update':
  path => '/usr/bin',
  require => File["/opt/node"]
}
# exec { 'apt-get python':
#   command => 'apt-get install python-software-properties python g++ make',	
#   path => '/usr/bin',
#   require    => Exec['apt-get update'],
# }
$nodejs_deps = [ "python-software-properties", "python", "g++", "make", "git", "vim" ]
    package { $nodejs_deps:
    ensure => installed,
    require => Exec["apt-get update"],
}
exec { "install_clean_node":
    command => "sudo add-apt-repository ppa:chris-lea/node.js",
    path => "/usr/bin:/usr/local/bin:/bin:/usr/sbin:/sbin",
    timeout => 0,
    require => Package[$nodejs_deps]
}
package { "nodejs":
        ensure  => installed,
    require => [Exec["apt-get update"], Exec["install_clean_node"]],
}


package { "redis-server":
        ensure  => installed,
    require    => Package['nodejs'],
}

service { 'redis-server':
    ensure     => running,
    enable     => true,
    hasrestart => true,
    require    => Package['redis-server'],
}

file { "/etc/redis/redis.conf":
    ensure  => present,
    mode    => '0644',
    source  => "puppet:///files/redis.conf",
#    notify => Service['redis-server'],
    require    => Package['redis-server'],
}
file { "/var/lib/redis/dump.rdb":
    ensure  => present,
    owner => redis,
    group => redis,
    mode    => '0660',
    source  => "puppet:///files/dump.rdb",
    notify => Service['redis-server'],
    #require    => Package['redis-server'],
    require => File["/etc/redis/redis.conf"]
}

# include nodejs

# include nodejs
# include monit
# include nginx
# include upstart
