दृष्टि (Drshti) - movies as books seen by computers
===

Drshti is a program that produces books out of movies.

Producing a `JSON` profile of the movie, as seen by several algorithmic processes:

* a screenshot is taken for each begining of subtitles
* each screenshot is processed with `densecap` algorithm for dense captioning

# More data (ideas)

* Use `gm` to get the degree of animation through image comparison of a scene and transform the typography accordingl
* Analyse audio data of the scene (waveform) to modify the typography
* use processing to isolate subset for each box and run gradient analysis

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

Then install GraphicsMagick :
```
brew update && brew install graphicsmagick
```


Then  :

```
mkdir data
npm install
```

Then copy your data in the data folder :

* `video.mp4` file
* `subtitle.srt` file
* `metadata.json` file

# Inspirations // design fork from ...

* [Stoj - An algorithm watching a movie trailer](http://stoj.io/projects/an-algorithm-watching-a-movie-trailer)
* [Frederic Broadbeck - cinemetrics](http://cinemetrics.fredericbrodbeck.de/)

# Acknowledgements

* ["DenseCap: Fully Convolutional Localization Networks for Dense Captioning". Justin Johnson, Andrej Karpathy, Li Fei-Fei - Densecap](https://github.com/jcjohnson/densecap)
* [Daniel Shiffman's port of densecap for node](https://github.com/shiffman/node-densecap)



