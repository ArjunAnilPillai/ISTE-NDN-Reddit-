# ISTE-NDN-Reddit-
## Description
The primary goal of this project was to design a proof of concept of a social media aggregation website, such as reddit, using the new internet architecture known as Named Data Networking(NDN).  The project focuses on using the resources provided by the open source NDN framework to build APIs that allow us to mimic the functioning of social media aggregation sites. This project demonstrates how this new architecture can implement such a social media aggregation site similar to what we observe in TCP/IP.
## Literature review
https://drive.google.com/file/d/1icZBiNvRZWKLhWpFFPf34_f7TIUyUGPZ/view?usp=sharing
## Presentation
https://docs.google.com/presentation/d/1Oq8pXWjFezB2xaOIhqSWqgdeML1dFVRtTKQU1ZBXVFw/edit?usp=sharing
## How To Run
### Prerequisites
1. Install NDN-CXX by following the instructions at this page:
https://named-data.net/doc/ndn-cxx/current/INSTALL.html
2. Install NDN Forwarding Daemon by following the instructions at this page: 
https://named-data.net/doc/NFD/current/INSTALL.html

### Running the Reddit Server
1. Run NFD in the background by opening a new terminal and entering the following command - `nfd-start`
2. Open the server.js and replace the MongoDB database acces string with one to your own database. 
3. Naviagte to the src folder of the repo and run the following commands
4. `npm install`
5. `node server.js`
6. Once the server is running, navigate to the client folder and open the 'login.html' page on the browser (ensure to use Firefox as the site uses cookies which Google Chrome does not support)
