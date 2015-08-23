---
layout: post
title: Intro to V-REP
---

Here is some basic information for getting started with the robot simulator [V-REP](http://www.coppeliarobotics.com/index.html). Since the organization of their documentation could use some improvement, I'll go over some of the key links and other important information. It is also worth loading up some of their demo scenes, which you can see with `file>open scene...` It should default to the folder with lots of examples.

#### Key V-REP Links

I'll give a few links to some important parts. Be sure to take note of the icons they have at the top of their page, because they are key to matching up between their interface and what button to actually push.

  - [Interface overview](http://www.coppeliarobotics.com/helpFiles/en/userInterface.htm)
  - [calculation properties dialog](http://www.coppeliarobotics.com/helpFiles/en/calculationModules.htm) where their internal inverse kinematics configuration can be configured, for example. 
    - [script dialog](http://www.coppeliarobotics.com/helpFiles/en/scriptProperties.htm) is how you look at what scripting is built into a simulation
    - [child scripts](http://www.coppeliarobotics.com/helpFiles/en/childScripts.htm) are how to manipulate objects in lua, this is the easiest thing to use and can be added by `right clicking on an object > add > scripts > threaded child script` 
  - [Full API Function List](http://www.coppeliarobotics.com/helpFiles/en/apiFunctions.htm) is the most useful page of all once the basics are covered is the full API function list:

One of the [keys to V-REP is child scripts](http://www.coppeliarobotics.com/helpFiles/en/childScripts.htm), which you can see the icon for it at the link. Those are the small lua scripts you can modify, plus you may need a one liner in there to activate the remote API. 

#### Interacting with objects in VREP Programmatically

If you've used any old GUI systems, you'll be familiar with the [handle system VREP uses](http://www.coppeliarobotics.com/helpFiles/en/accessingGeneralObjects.htm). Essentially, physical objects in the simulation can be represented as a string or an integer "handle" which is an index into an internal lookup table V-REP stores. You pass those handles to the VREP API functions to perform a scripted action like changing joint angles on an object.

#### Remote APIs, MATLAB, Python

This is their [page for the remote APIs](http://www.coppeliarobotics.com/helpFiles/en/remoteApiOverview.htm). I haven't tried the MATLAB API or any other remote/external API myself. It is also worth noting remote APIs have reduced performance and a reduced set of  functions when compared to the lua and C/C++ APIs that I use. 

Of the external APIs, if you know python that may also be worth considering over MATLAB because it has an equally complete set of scientific libraries and doesn't depend on a license. For those using the [UR5](http://www.universal-robots.com/products/ur5-robot/) robot, I believe the [cisst](https://github.com/jhu-cisst/cisst) UR5 library is accessible from python although I haven't used it personally. 

#### Python + Studywolf blog

While not related to V-REP directly, the [study wolf blog](https://studywolf.wordpress.com/) has a series of FANTASTIC tutorials on [kinematics and control in python](https://studywolf.wordpress.com/?s=robot+control), [with code](https://github.com/studywolf/blog). The information on that blog is useful for understanding some of the underlying robotics concepts utilized by V-REP. At the bottom of each page on the studywolf blog you can browse more of his articles specifically.

#### Using V-REP and matlab to simplify coursework

One more interesting link I came across uses [V-REP and matlab to simplify coursework](http://teaching-robotics.org/trs2014/) called [TRS](http://ulgrobotics.github.io/trs/setup.html).

#### lua APIs and matrices

In case it is useful, [luamatrix provides a set of pure lua matrix functions](https://github.com/davidm/lua-matrix). I haven't tried it but it did take some time to find so I figured I'd share that. Also, [How to integrate an external lua library](http://www.forum.coppeliarobotics.com/viewtopic.php?f=9&t=3991) can be found in the V-REP forums.

#### Scene Hierarchy

The [Scene Hierarchy](http://www.coppeliarobotics.com/helpFiles/en/userInterface.htm) is the list of objects on the left-hand side of V-REP with things that are already in your simulation.

Sometimes there will be a tab indentation of one object to the bottom right of the other, this is particularly obvious when you look at an arm and how all the indentations slant to the right from top to bottom. This Indentation means that the object is represented in the coordinate frame of the parent object, so if you for example rotate the first link of the arm all the child links are moved with it. 

I used this in combination with dummy objects for my system. Dummy objects are useful because they provide a physical frame that you can see in the simulation to attach your objects to and move everything relative to. For example with my bone which had an optical tracker fiducial attached, I put a dummy object a position where the fiducials control point is I made the bone a child that so then when I move the bone The optical tracker would detect that and set the position of the dummy the new detected position on the bone with corresponding we move in the simulation to it's real time position. 


#### Conclusion

Hopefully that is a decent amount of starter info pointing to some of the key items!