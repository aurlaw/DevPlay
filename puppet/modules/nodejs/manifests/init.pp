class nodejs {

package { 'nodejs':
        ensure  => installed,
        # require    => Package['nodejs'],
}


  # $nodejs_deps = [ "python-software-properties", "python", "g++", "make", "vim" ]
  #     package { $nodejs_deps:
  #     ensure => installed
  #     # require => Exec["apt-get update"],
  # }
  # exec { "install_clean_node":
  #     command => "sudo add-apt-repository ppa:chris-lea/node.js",
  #     path => "/usr/bin:/usr/local/bin:/bin:/usr/sbin:/sbin",
  #     timeout => 0,
  #     require => Package[$nodejs_deps]
  # }
  # package { "nodejs":
  #     ensure  => installed,
  #     require => Exec["install_clean_node"]
  # }


}