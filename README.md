Ohm - a print collection of youtube videos
===

* start with a video and its subtitles
* decompose the video into frames (https://github.com/robindemourat/video-to-frames-mosaics)
* analyse each video with densecap and extract the result (https://github.com/robindemourat/node-densecap)
* produce a generative book inspired by it, in which each page is a close-up on the frame, an quote of the current subtitle, and the description given by densecap


JSON representation of a page of the book :

```json
{
    "subtitle": "",
    "captions": [],
    "image": "base64"
}
```


# Installation

Install Torch :

```
git clone https://github.com/torch/distro.git ~/torch --recursive
cd ~/torch; bash install-deps;
./install.sh
```

Then upgrade path :

```
nano ~/.bash_profile
```
Then add the following:

```
PATH=$PATH\:/Users/yourusername/torch/install/bin ; export PATH
```

Then update dependencies for densecap (https://github.com/jcjohnson/densecap#installation) :

```
luarocks install torch
luarocks install nn
luarocks install image
luarocks install lua-cjson
luarocks install https://raw.githubusercontent.com/qassemoquab/stnbhwd/master/stnbhwd-scm-1.rockspec
luarocks install https://raw.githubusercontent.com/jcjohnson/torch-rnn/master/torch-rnn-scm-1.rockspec
```

Then download pretrained model :

```
./download_pretrained_model.sh
```

Then install prince xml

Then 

```
mkdir data
mkdir temp
npm install
```

Then copy your data in the data folder :

* `video.mp4` file
* `subtitle.srt` file
* `metadata.json` file


