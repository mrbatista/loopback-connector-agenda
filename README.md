# loopback-connector-agenda
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][daviddm-url]][daviddm-image]

The [Agenda](https://github.com/agenda/agenda) connector for the LoopBack framework.

## Install

```bash
$ npm install --save loopback-connector-agenda
```

## Customizing MongoDB configuration for tests/examples

By default, examples and tests from this module assume there is a MongoDB server
instance running on localhost at port 27017.

To customize the settings, you can drop in a `.loopbackrc` file to the root directory
of the project or the home folder.

**Note**: Tests and examples in this project configure the data source using the deprecated '.loopbackrc' file method,
which is not suppored in general.
For information on configuring the connector in a LoopBack application, please refer to [LoopBack documentation](http://docs.strongloop.com/display/LB/MongoDB+connector).

The .loopbackrc file is in JSON format, for example:
```json
    {
        "dev": {
            "mongodb": {
                "host": "127.0.0.1",
                "database": "dev",
                "username": "youruser",
                "password": "yourpass",
                "port": 27017
            }
        },
        "test": {
            "arangodb": {
                "host": "127.0.0.1",
                "database": "test",
                "port": 27017
            }
        }
    }
```
    
**Note**: username/password is only required if the MongoDB server has
authentication enabled.

## Contributing

**We love contributions!**

When contributing, follow the simple rules:

* Don't violate [DRY](http://programmer.97things.oreilly.com/wiki/index.php/Don%27t_Repeat_Yourself) principles.
* [Boy Scout Rule](http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule) needs to have been applied.
* Your code should look like all the other code – this project should look like it was written by one man, always.
* If you want to propose something – just create an issue and describe your question with as much description as you can.
* If you think you have some general improvement, consider creating a pull request with it.
* If you add new code, it should be covered by tests. No tests – no code.
* If you add a new feature, don't forget to update the documentation for it.
* If you find a bug (or at least you think it is a bug), create an issue with the library version and test case that we can run and see what are you talking about, or at least full steps by which we can reproduce it.

## Running tests

The tests in this repository are mainly integration tests, meaning you will need
to run them using our preconfigured test server.

1. Ask a core developer for instructions on how to set up test server
   credentials on your machine
2. `npm test`

## License

[MIT](LICENSE)


[npm-url]: https://npmjs.org/package/loopback-connector-agenda
[npm-image]: https://badge.fury.io/js/loopback-connector-agenda.svg
[travis-url]: https://travis-ci.org/mrbatista/loopback-connector-agenda
[travis-image]: https://travis-ci.org/mrbatista/loopback-connector-agenda.svg?branch=master
[coveralls-url]: https://coveralls.io/github/mrbatista/loopback-connector-agenda?branch=master
[coveralls-image]: https://coveralls.io/repos/github/mrbatista/loopback-connector-agenda/badge.svg?branch=master
[daviddm-url]: https://david-dm.org/mrbatista/loopback-connector-agenda.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/mrbatista/loopback-connector-agenda
