# meta-ip-search

## Purpose

GitHub publishes a list of the IP address ranges used by its various services in the [meta endpoint of the REST API](https://api.github.com/meta). While this information is easy to programmatic consumption, such as when writing a script to import the ranges into a firewall's allow list, most of us who aren't network engineers can't quickly expand CIDR notation out to IP address ranges in our heads.

The purpose of this utility is to provide a search interface for IP range coverage. It loads the IP ranges from the API's meta endpoint, and then calculates whether or not the searched IP falls within any of those ranges.

This utility operates entirely in the browser, and no data of any kind is transmitted to any back-end or external service.
