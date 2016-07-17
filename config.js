'use strict';

module.exports = {
	app: {
		title: 'Reekoh - GPS Tracking'
	},
	port: 18358,
    mongo: {
        url: process.env.MONGO_URL || 'mongodb://reekohdev:Reekoh2016@aws-us-east-1-portal.10.dblayer.com:10737,aws-us-east-1-portal.11.dblayer.com:27194/reekoh-dev-system',
        key: process.env.MONGO_KEY || '-----BEGIN CERTIFICATE-----\nMIIDYTCCAkmgAwIBAgIEVsx1qjANBgkqhkiG9w0BAQ0FADAyMTAwLgYDVQQDDCdS\nZWVrb2gtMzg1MGIxZDAyNjExYmQwMTJmOGFjNmJlOGQ0Mjg4NzEwHhcNMTYwMjIz\nMTUwNzIyWhcNMTcwMjIyMTUwNzIyWjAyMTAwLgYDVQQDDCdSZWVrb2gtMzg1MGIx\nZDAyNjExYmQwMTJmOGFjNmJlOGQ0Mjg4NzEwggEiMA0GCSqGSIb3DQEBAQUAA4IB\nDwAwggEKAoIBAQCm+o4HPpsRyc6MtVAm3JNGGShU7wSlEB5wJ28Ia3Fh8anRbvu/\nbmZOxu6i9A051sSzGgh4wphSIjXvpkYnwfE9ofc+KRs9BYKBizv4rppi5RmRwvHk\n4XfT7RO4BjMymDD+waS9QOgXK3DybOCIM+rk1I/cg21xHj7NiovEirBnHzk+yREk\n7ViS8LX25/ogPYIhk6cCfr/uEj0bgvM1RA/VQcAkUEU/1PqDwI3rlBd3cBGeaR0L\na98WdCCdq6d411kGl/uc4PK+z7jNYbVZYz2hb5tltmtgJq4onE7t2NJk8LFJtPjm\niXgmgFhSKjebvY7qVgzVJEnHOABCHZCZS4rrAgMBAAGjfzB9MB0GA1UdDgQWBBSa\nrS++VwqCnB9GL3Fpb7fyBdLCCzAOBgNVHQ8BAf8EBAMCAgQwHQYDVR0lBBYwFAYI\nKwYBBQUHAwEGCCsGAQUFBwMCMAwGA1UdEwQFMAMBAf8wHwYDVR0jBBgwFoAUmq0v\nvlcKgpwfRi9xaW+38gXSwgswDQYJKoZIhvcNAQENBQADggEBADIG1W0yWxw/qZx1\nIxSHyOOp5lt1dx7lz430mcz7C5ih9TQCCLY1p6+FZI2SaOLsKE/EQKG8E//zxMPY\n31z3HGWu36AjhINZeMXzzlomobH+788ybRMcaGchslZxSVrWTw/jtOJxAbROJw3a\n+16NjHfO64gAYQKrx5FOsbbkt5HGmjUerU2op5vl8w6+H/excADNUApN+4g1TNcw\nXoXKNzAYSlygj8L0q7XBilaJwhmyTH007kDt60acJCIwPZJPCVTIUOI/A/eJ63xc\nnJd9+f+kyLSkg+OqY/BHxVsN0wCqu7ju5Fd8gU/LGr27pMzyoCF5/yZyYHHQZpaU\nXEOKtMM=\n-----END CERTIFICATE-----\n'
    }
};
