# ABC Assist 
### Premise

Virginia Alcoholic Beverage Control Authority (ABC) hatched a way to make access to highly prized products more democratic. These special release products are sent out to randomly selected ABC stores, and then their sale is both opened and randomly announced at the same time. The way to be notified of these releases is via their email newsletter, through which you are sent a link that looks like [this](https://www.abc.virginia.gov/limited/allocated_stores_02_06_2023_02_30_pmlhHUeqm1xIf7QPX8FDXhde8V.html). It contains the locations through the state that are part of that special release. 

Living in Washington, D.C., there are plenty of stores nearby for these releases. The challenges is two-fold. Firstly, when this email goes out, there is a mad rush on the locations. One afternoon I was sat across the street from one of the locations in a coffee shop remote working when the email went out. I finished up what I was doing for a moment and walked across not twenty minutes after the email went out. The line was already almost out the door with half of the products gone.

Secondly is that these closest locations are scattered throughout Northern Virginia, a land of many townships and municipalities. When you get that link and live in the area, it is tough to sort through the townships and find the store closest to you in a truly quick and easy manner. 

This project solves that problem. 

### Purpose

This tool is of personal practical use to me, but I of course endeavored to solve this highly practical problem with a set of tech on which I could expand my skill set. I really wanted to dive deeper into the basic AWS application architecture and use it to host something public that I scaffolded. I also wanted to get more comfortable with Docker and the AWS + Docker combo. Node and React are familiar, but this was still good practice and the opportunity to do something from scratch, trying to keep it as simple as possible. 

### Approach and Tech Stack

The simple goal is to give the user a way to take the url they're sent and get their closest locations from it. The UI gives them a way to geolocate from the browser and to use a typed city + state combo instead of that (in case the gelocation is failing for some reason).

Concepts I wanted to explore:
* Web scraping (making useful data out of the URL's HTML) 
* Devops - Docker + AWS
* As always, strengthen React patterns

The resulting stack:
* UI: React
* Server: Node 
* Application Server: Nginx
* Application Container: Docker
* Domain: GoDaddy
* Infrastructure/Hosting: AWS
  * Route 53
  * Network Load Balancer
  * EC2

#### Monolithic Repo Structure 

I knew this app would end up being relatively simple, at least for Version 1. Despite the benefits of separating my server and client, I thought having everything contained would teach me more about networking *and* make it simpler to iterate. After development of V1, I stand by that assumption. Having one Git flow and one deployment for the whole thing made the process quick. I iterated locally, spun up the local Docker environment with docker-compose as a "staging" test, and then would deploy to EC2 as production (unreleased, so no downtime concerns.)

For this approach I leaned on [this template](https://www.webscale.com/engineering-education/build-and-dockerize-a-full-stack-react-app-with-node-js-mysql-and-nginx/) by [Moses Maina](https://github.com/mosesreigns) as a starting point. 

### Next Steps

#### Devops

I got the baseline infrastructure in place, but I want to go the next-level deep with making this a truly highly-available application. Auto-scaling is crucial (especially in case this blows up amongst Virginians as a resource). Also, I'm really interseted in developer tooling and I want to create a healthy pipleine deployment process for this. This would ideally include a way to make changes to just the server or the client side and push those up into the architecture. Either way, the priority is a way to deploy new changes, even if it starts with requiring redeployment of this whole composed container system. 

Oh, additionally, I need a better set of environment variables to allow for making this work more smoothly locally instead of having to edit the post request URL for the client when I'm doing local dev. Ideally I'd set up a watch-style local development server for the BE and FE. I'm basically there on the BE with nodemon. 

#### Server

I see a lot of opportunity here. One concept for future dev is to have a service on AWS listening for email activity and to process each and every drop that comes through. The data would be compiled and I would be able to create a dashboard for viewing that data, potentially getting into all kinds of things. Maybe using ML to make predictions on patterns for future drops. Maybe trying to use statistics to do that myself. I'd also be able to serve the latest drop at the top of abcassist.info automatically. 

#### Client

Is an application ever truly finished? I think of David Fincher's "Movies aren't finished. They are abandoned." quote here. At the time of this writing, I need significant styling work to be proud of what I've produced. It's good enough for V1 though, and this project has had a long enough arc before public consumption. 

### Run It

#### Env Variables
##### SERVER
* GOOGLE_MAPS_KEY= *You'll need a Google API Key [(here's a decent start)](https://developers.google.com/maps/documentation/places/web-service/cloud-setup) to query the APIs I use in this project. You get a good amount of credits, but it does cost. That's why I have dummydata in use.*
* NODE_ENV= 
  * *dev || prod - dev will use the dummyData and not cost you API pings*
  * There are two dummy data points:
    * The Google Place for the typed city + state current location: this from Arlington because [the dummy link I use](https://www.abc.virginia.gov/limited/allocated_stores_02_06_2023_02_30_pmlhHUeqm1xIf7QPX8FDXhde8V.html) has locations close to there (and my DC metroplex bias). 
    * The return of the whole list of Google Places for the locations in the link provided in this README. That saves you 112 API pings in this case : ) 


#### Docker 
This project will run in docker from the docker-compose with a simple "docker-compose up --build". Of course you'll need to have [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/linux/) installed. 

#### Completely Local
You can also run "npm install" && "npm run start" in both the SERVER and client directories to get a client server on localhost:3000 and the BE running on localhost:3001. **Important** - see environment details below. 





