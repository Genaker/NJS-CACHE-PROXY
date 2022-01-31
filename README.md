# NJS-CACHE-PROXY
NodeJS replacement of the legacy Varnish Software

# NJS-CACHE or Nodish - An alternative of the Varnish Cache written on Node.JS
Magento 2 uses Varnish between the client and our backend server. It helps to support more concurrent accesses to our Magento website by caching in the and not hitting broken Magento PHP code every request. However, you need to use the domain-specific language "VCL" to define the cache policy. With node JS we can write Javascript code as a configuration and modules. NJS-CACHE is a pure Javascript (node.js) solution to replace legacy Varnish in your server.

# Run the server
In my environment, I can start the server with this command.
```npm install```
```node server.js```
That simple. This starts a proxy server listening on port 8880.

# Node JS Performance and benefits vs Varnish CACHE 
* Single Threaded
* V8 JS engine with JIT compilation
* Easy To customize and code new features. Just a pure JS code vs silly VCL
* Can use different adapters to save the cache: memory, files, DB, Redis, Memcache, S3 whatever
* High Availability and Scalability. Varnish has a big issue with the scalability
* Async I/O, when you are working with the files, Redis, HTTP. All communication is asynchronous
* Low Cost
* Hig connectivity 
* Serverless compatible
* ARM-compatible
* TSL/SSL HTTPS Support

# Features
* caching
* cache Info
* cache invalidation by tags
* purge all: tag=all

# Performace Measurement
* Time of the response from the cache: 0.087ms 

![image](https://user-images.githubusercontent.com/9213670/151731280-9a6f8e8c-7d50-4a9a-92b5-da4629cc1adb.png)

* Resonse time 100 parallel requests 16ms per request or 4697.47 req/sec:
![image](https://user-images.githubusercontent.com/9213670/151731202-f8f3a09a-1249-47a4-b3ed-cce7aa81fe1f.png)

* Resonse time 1000 parallel requests 156ms per request or 4571.65 req/sec:
![image](https://user-images.githubusercontent.com/9213670/151731347-afd615e4-c22d-4bce-ab07-8447d22453a1.png)
