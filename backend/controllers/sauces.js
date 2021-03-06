// in controllers/stuff.js

const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  req.body.sauce = JSON.parse(req.body.sauce);
  const url = req.protocol + '://' + req.get('host');
  const sauce = new Sauce({
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    heat: req.body.sauce.heat,
    likes: req.body.sauce.likes,
    dislikes: req.body.sauce.dislikes,
    imageUrl: url + '/images/' + req.file.filename,
    mainPepper: req.body.sauce.mainPepper,
    usersLiked: req.body.sauce.usersLiked,
    usersDisliked: req.body.sauce.usersDisliked,
    userId: req.body.sauce.userId
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
        _id: req.params.id,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        heat: req.body.sauce.heat,
        likes: req.body.sauce.likes,
        dislikes: req.body.sauce.dislikes,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        usersLiked: req.body.sauce.usersLiked,
        usersDisliked: req.body.sauce.usersDisliked,
        userId: req.body.sauce.userId
    };
  } else {
    sauce = {
        _id: req.params.id,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        heat: req.body.heat,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        imageUrl: req.body.imageUrl,
        mainPepper: req.body.mainPepper,
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked,
        userId: req.body.userId
    };
  }
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        Sauce.deleteOne({_id: req.params.id}).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    }
  );
};


exports.likeSauce = (req, res, next) => {
  if(!req.body.id){
    res.json({ success: false, message: 'No id was provided'});
  } else {
    sauce.findOne({ _id: req.body.id}, (err, sauce) => {
      if (err) {
        res.json({success: false, message: 'Invalid sauce id'});
      }else {
        if(!sauce) {
          res.json({ success: false, message: 'That sauce was not found.'});
        }else {
          user.findOne({ _id:req.decoded.userId }, (err, user) => {
            if (err) {
              res.json({ success:false, message: 'Something went wrong.'});
            } else {
              if (!user) {
                res.json({ success:false, message: 'Could not authenticate user.'});
              }else {
                if (user.name === sauce.createdBy) {
                  res.json({ success: false, message: 'can not like your own post.'});
                }else {
                  if(sauce.likes.includes(user.name)) {
                    res.json({success:false, message: 'You already liked this post.'});
                  }else {
                    if (sauce.usersDisliked.includes(user.name)){
                      sauces.dislikes--;
                      const arrayIndex = sauce.usersDisliked.indexOf(user.name);
                      sauce.usersDisliked.splice(arrayIndex, 1);
                      sauce.likes++;
                      sauce.usersLiked.push(user.name);
                      sauce.save((err) => {
                        if(err){
                          res.json({ success:false, message: 'something went wrong.'});
                        } else {
                          res.json({ success: true, message: 'Sauce liked!'});
                        }
                      });
                    } else {
                      sauce.likes++;
                      sauce.usersLiked.push(user.name);
                      sauce.save((err) => {
                        if(err){
                          res.json({ success:false, message: 'something went wrong.'});
                        } else {
                          res.json({ success: true, message: 'Sauce liked!'});
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }
};
 
exports.dislikeSauce = (req, res, next) => {
  if(!req.body.id){
    res.json({ success: false, message: 'No id was provided'});
  } else {
    sauce.findOne({ _id: req.body.id}, (err, sauce) => {
      if (err) {
        res.json({success: false, message: 'Invalid sauce id'});
      }else {
        if(!sauce) {
          res.json({ success: false, message: 'That sauce was not found.'});
        }else {
          user.findOne({ _id:req.decoded.userId }, (err, user) => {
            if (err) {
              res.json({ success:false, message: 'Something went wrong.'});
            } else {
              if (!user) {
                res.json({ success:false, message: 'Could not authenticate user.'});
              }else {
                if (user.name === sauce.createdBy) {
                  res.json({ success: false, message: 'can not dislike your own post.'});
                }else {
                  if(sauce.dislikes.includes(user.name)) {
                    res.json({success:false, message: 'You already disliked this post.'});
                  }else {
                    if (sauce.usersLiked.includes(user.name)){
                      sauces.likes--;
                      const arrayIndex = sauce.usersLiked.indexOf(user.name);
                      sauce.usersLiked.splice(arrayIndex, 1);
                      sauce.dislikes++;
                      sauce.usersDisliked.push(user.name);
                      sauce.save((err) => {
                        if(err){
                          res.json({ success:false, message: 'something went wrong.'});
                        } else {
                          res.json({ success: true, message: 'Sauce disliked!'});
                        }
                      });
                    } else {
                      sauce.dislikes++;
                      sauce.usersDisliked.push(user.name);
                      sauce.save((err) => {
                        if(err){
                          res.json({ success:false, message: 'something went wrong.'});
                        } else {
                          res.json({ success: true, message: 'Sauce disliked!'});
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }
};
    



exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};