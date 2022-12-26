<p align="center">
  <a href="https://kba.ai/">
    <img alt="KBA" src="https://elearning.kba.ai/asset-v1:KBA+CHFSP2V3+2021_T4+type@asset+block@chd.png" width="300">
  </a>
</p>

<p align="center">
  An Permissioned Blockchain based Public Procurement System, provides interactive decentralized auction system.
</p>

## Installation

### Installing Basic Dependencies

To install the basic dependencies such as node, npm, jq, sponge and docker, navigate to Networks folder and execute the command

bash
$ ./installDependencies.sh

Once the installation is complete, restart the machine.

Insure the node module installation in all folders "kba-pharmaceutical,Event,Client,UI".

### Installing Minifab Binary

bash
$ ./installDependencies.sh bin

## Starting the network

Make sure you have installed all the dependencies before following this step, to start the network we have provided a script available inside the Network folder

bash
$ ./startNetwork.sh


## To bring down the network

Make sure you have installed all the dependencies before following this step, to start the network we have provided a script available inside the Network folder

bash
$ minifab cleanup -o producer.pharma.com
