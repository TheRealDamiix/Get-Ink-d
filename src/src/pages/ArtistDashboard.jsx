
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Trash2, Plus, Eye, Calendar, Users, Star, RefreshCw } from 'lucide-react';

const ArtistDashboard = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    location: '',
    styles: [],
    bookingStatus: false,
    bookedUntil: '',
    bookingLink: ''
  });
  
  const [newStyle, setNewStyle] = useState('');
  const [newImage, setNewImage] = useState({ image: '', caption: '' });
  const [showImageDialog, setShowImageDialog] = useState(false);

  useEffect(() => {
    if (!user || !user.isArtist) {
      navigate('/');
      return;
    }

    setProfile({
      name: user.name || '',
      bio: user.bio || '',
      location: user.location || '',
      styles: user.styles || [],
      bookingStatus: user.bookingStatus || false,
      bookedUntil: user.bookedUntil || '',
      bookingLink: user.bookingLink || ''
    });
  }, [user, navigate]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    const updatedUser = {
      ...user,
      ...profile,
      lastActive: new Date().toISOString()
    };
    
    updateUser(updatedUser);
    
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated."
    });
  };

  const handleAddStyle = () => {
    if (newStyle.trim() && !profile.styles.includes(newStyle.trim())) {
      setProfile({
        ...profile,
        styles: [...profile.styles, newStyle.trim()]
      });
      setNewStyle('');
    }
  };

  const handleRemoveStyle = (styleToRemove) => {
    setProfile({
      ...profile,
      styles: profile.styles.filter(style => style !== styleToRemove)
    });
  };

  const handleAddImage = () => {
    if (newImage.image.trim()) {
      const imageData = {
        image: newImage.image,
        caption: newImage.caption,
        createdDate: new Date().toISOString()
      };

      const updatedPortfolio = [...(user.portfolio || []), imageData];
      const updatedUser = {
        ...user,
        portfolio: updatedPortfolio,
        lastActive: new Date().toISOString()
      };

      updateUser(updatedUser);
      setNewImage({ image: '', caption: '' });
      setShowImageDialog(false);

      toast({
        title: "Image added!",
        description: "Your portfolio has been updated."
      });
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedPortfolio = user.portfolio.filter((_, index) => index !== indexToRemove);
    const updatedUser = {
      ...user,
      portfolio: updatedPortfolio,
      lastActive: new Date().toISOString()
    };

    updateUser(updatedUser);

    toast({
      title: "Image removed",
      description: "The image has been removed from your portfolio."
    });
  };

  const handleVisibilityRefresh = () => {
    const updatedUser = {
      ...user,
      lastActive: new Date().toISOString()
    };

    updateUser(updatedUser);

    toast({
      title: "Visibility refreshed!",
      description: "Your profile has been moved to the top of search results."
    });
  };

  if (!user || !user.isArtist) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold ink-text-gradient">Artist Dashboard</h1>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <a href={`/artist/${user.username}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </a>
              </Button>
              <Button onClick={handleVisibilityRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Visibility
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{user.followers?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
              </div>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Upload className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold">{user.portfolio?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Portfolio Images</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  placeholder="City, State"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Tell clients about yourself and your style..."
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label>Tattoo Styles</Label>
              <div className="flex gap-2">
                <Input
                  value={newStyle}
                  onChange={(e) => setNewStyle(e.target.value)}
                  placeholder="Add a style (e.g., Traditional, Realism)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStyle())}
                />
                <Button type="button" onClick={handleAddStyle} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.styles.map((style, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                  >
                    {style}
                    <button
                      type="button"
                      onClick={() => handleRemoveStyle(style)}
                      className="text-primary hover:text-primary/70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="booking-status"
                  checked={profile.bookingStatus}
                  onCheckedChange={(checked) => setProfile({...profile, bookingStatus: checked})}
                />
                <Label htmlFor="booking-status">Currently accepting bookings</Label>
              </div>

              {profile.bookingStatus && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div className="space-y-2">
                    <Label htmlFor="booked-until">Booked Until (Optional)</Label>
                    <Input
                      id="booked-until"
                      type="date"
                      value={profile.bookedUntil}
                      onChange={(e) => setProfile({...profile, bookedUntil: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-link">Booking Link</Label>
                    <Input
                      id="booking-link"
                      value={profile.bookingLink}
                      onChange={(e) => setProfile({...profile, bookingLink: e.target.value})}
                      placeholder="https://your-booking-site.com"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="ink-gradient">
              Update Profile
            </Button>
          </form>
        </motion.div>

        {/* Portfolio Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Portfolio Management</h2>
            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
              <DialogTrigger asChild>
                <Button className="ink-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Portfolio Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-url">Image URL</Label>
                    <Input
                      id="image-url"
                      value={newImage.image}
                      onChange={(e) => setNewImage({...newImage, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-caption">Caption (Optional)</Label>
                    <Textarea
                      id="image-caption"
                      value={newImage.caption}
                      onChange={(e) => setNewImage({...newImage, caption: e.target.value})}
                      placeholder="Describe this tattoo..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddImage} className="ink-gradient">
                      Add Image
                    </Button>
                    <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {user.portfolio && user.portfolio.length > 0 ? (
            <div className="portfolio-grid">
              {user.portfolio.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-2">
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {item.caption && (
                    <p className="text-sm text-muted-foreground">{item.caption}</p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No portfolio images yet</h3>
              <p className="text-muted-foreground mb-6">
                Start building your portfolio by adding your best tattoo work
              </p>
              <Button onClick={() => setShowImageDialog(true)} className="ink-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Image
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ArtistDashboard;
