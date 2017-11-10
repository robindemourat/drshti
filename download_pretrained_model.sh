# create a folder to host the densecap strings
mkdir -p data/models/densecap
cd data/models/densecap
# download them (> 1Go)
wget http://cs.stanford.edu/people/jcjohns/densecap/densecap-pretrained-vgg16.t7.zip
unzip densecap-pretrained-vgg16.t7.zip
rm densecap-pretrained-vgg16.t7.zip
cd ../../../