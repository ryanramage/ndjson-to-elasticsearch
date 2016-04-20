ndjson-to-elasticsearch
=================

Pipe ndjson into elasticsearch. Strems out the doc with the new _id.

This is really similar to the ndjson-to-couch module. But es has now slightly different semantics around the _id property not allowed to be 
in the doc. That is the main reason for the fork.

Install
-------

    npm i ndjson-to-elasticsearch -g

Usage
-----

    cat tests/assets/example.njson | ndjson-to-elasticsearch http://localhost:9200/test/tweet

Options
-------

  - --key=keyname the name of the field to use to set the id as.
  - --copy_fields_from_prev_rev=a,b preserve the fields a and b values by copying the val from the old doc to the new doc
  - --swallowErrors swallow errors returned from elasticsearch
  - --retryTimes how many times to retry because es can drop connections
  - --retryInterval how long to wait in ms between retry attemps
