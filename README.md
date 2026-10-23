# Serve Up

i have a problem. i dont keep a track of my chrome tabs, and they end up slowing my pc down. and i HAD to fix this coz who is going to close 100 tabs without properly seeing if an important one is being closed? so, i made something :D

i was playing ace attorney (great game btw) the other day, and i figured i could use this entire premise in some way. so, i combined a court room with your browser. your browser tabs have been served!

## Installation

this is a chrome extension, and not your typical app/webpage. to install and enable it, follow these steps:

 1) download the release, extract it into a folder.
 2) open chrome, click on the `Extensions` tab on the top right. if its not visible, go to settings -> extensions.
 3) click on manage extensions
 4) on the top right, enable `Developer Mode`
 5) click on `Load Unpacked` and select the extracted folder. NOT the files, the folder which was extracted.
 6) you should now have the extension. click on it, click on summon a tab, and have fun judging your tabs :D

## Which tabs are prosecuted? 

there are 2 types of tabs which the extension works with. duplicate, and stale. there's another type (which ill explain in a bit)

### Duplicates

duplicate tabs are quite self explanatory, any tab which has more than 1 instance open in your browser. clicking on close closes all other instances and leaves just 1 open.

### Stales

any tab which hasnt been opened for over an hour, is counted as a stale tab.

### Immune

well, what if you DONT want specific tabs to be prosecuted? for that, i have implemented immunity. you can give immunity to any tab that you wish to not prosecute, so it'll not come in the tab roll. you can revoke your immunity too, incase you want it be prosecuted again!

---

this project is just a fun little attempt to practicing javascript, as well as explore other domains of software. this was created during and for HackClub Expedition!
