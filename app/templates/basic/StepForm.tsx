import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/templatesPreview/basicPreviewStore';
import { updateProductField, updateShopField, updateFaqList, updateSocialMediaTemplates } from '../../../redux/templatesPreview/basicPreviewSlice';
import { SocialMediaPostTemplate } from '../../../models/basicPreview.model';
import FreeTextEditor from '../../../text-editors/freeTextEditor';
import { getPlatformLayout } from './platformLayouts';
import { toast } from 'sonner';

interface StepFormProps {
  onComplete: () => void;
}

const StepForm: React.FC<StepFormProps> = ({ onComplete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentStep, setCurrentStep] = useState(1);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newTemplate, setNewTemplate] = useState<SocialMediaPostTemplate>({
    platform: "Facebook",
    templateName: "",
    caption: "",
    hashtags: [],
    imagePlaceholders: [],
    productUrl: "",

  });

  const productDetails = useSelector((state: RootState) => state.basicPreview.productDetails);
  const shopDetails = useSelector((state: RootState) => state.basicPreview.shopDetails);
  const faqList = useSelector((state: RootState) => state.basicPreview.faqList);
  const socialMediaTemplates = useSelector((state: RootState) => state.basicPreview.socialMediaTemplates);

  const handleProductContentSave = (field: keyof typeof productDetails, content: string, style: object) => {
    dispatch(updateProductField({ field, content, style }));
  };

  const handleShopContentSave = (field: keyof typeof shopDetails, content: string, style: object) => {
    dispatch(updateShopField({ field, content, style }));
  };

  const addFaq = () => {
    if (newFaq.question && newFaq.answer) {
      dispatch(updateFaqList([...faqList, newFaq]));
      setNewFaq({ question: '', answer: '' });
    }
  };

  const addTemplate = () => {
    if (newTemplate.platform && newTemplate.templateName && newTemplate.caption) {
      const platformLayout = getPlatformLayout(newTemplate.platform);
      const templateWithLayout = {
        ...newTemplate,
        style: platformLayout.defaultStyle,
        callToAction: platformLayout.preferredCTA
      };
      
      dispatch(updateSocialMediaTemplates([...socialMediaTemplates, templateWithLayout]));
      setNewTemplate({
        platform: "Facebook",
        templateName: "",
        caption: "",
        hashtags: [],
        imagePlaceholders: [],
        productUrl: "",
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Product Details</h2>
            <div>
              <label className="block font-semibold text-gray-700">Product Name</label>
              <FreeTextEditor
                value={productDetails.productName.content}
                onSave={(content: string, style: object) => handleProductContentSave("productName", content, style)}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Product Price</label>
              <FreeTextEditor
                value={productDetails.productPrice.content}
                onSave={(content: string, style: object) => handleProductContentSave("productPrice", content, style)}
                placeholder="Enter product price"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Short Description</label>
              <FreeTextEditor
                value={productDetails.shortDescription.content}
                onSave={(content: string, style: object) => handleProductContentSave("shortDescription", content, style)}
                placeholder="Enter short description"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Long Description</label>
              <FreeTextEditor
                value={productDetails.longDescription.content}
                onSave={(content: string, style: object) => handleProductContentSave("longDescription", content, style)}
                placeholder="Enter detailed product description"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Quality Features</label>
              <FreeTextEditor
                value={productDetails.qualityFeatures.content}
                onSave={(content: string, style: object) => handleProductContentSave("qualityFeatures", content, style)}
                placeholder="Enter product quality features"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Specifications</label>
              <FreeTextEditor
                value={productDetails.specifications.content}
                onSave={(content: string, style: object) => handleProductContentSave("specifications", content, style)}
                placeholder="Enter product specifications"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Product Pictures</label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                {productDetails.productPictures.map((picture, index) => (
                  <div key={index} className="relative">
                    <img src={picture.url} alt={`Product ${index + 1}`} className="w-full h-48 object-cover rounded" />
                    <button
                      onClick={() => {
                        const updatedPictures = [...productDetails.productPictures];
                        updatedPictures.splice(index, 1);
                        dispatch(updateProductField({ field: "productPictures", content: updatedPictures, style: {} }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const newPictures = files.map(file => ({
                    url: URL.createObjectURL(file)
                  }));
                  dispatch(updateProductField({
                    field: "productPictures",
                    content: [...productDetails.productPictures, ...newPictures],
                    style: {}
                  }));
                }}
                className="mt-2"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Product Videos</label>
              <div className="mt-2 space-y-4">
                {productDetails.productVideos.map((video, index) => (
                  <div key={index} className="relative">
                    <video src={video.url} controls className="w-full rounded" />
                    <button
                      onClick={() => {
                        const updatedVideos = [...productDetails.productVideos];
                        updatedVideos.splice(index, 1);
                        dispatch(updateProductField({ field: "productVideos", content: updatedVideos, style: {} }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const newVideos = files.map(file => ({
                    url: URL.createObjectURL(file)
                  }));
                  dispatch(updateProductField({
                    field: "productVideos",
                    content: [...productDetails.productVideos, ...newVideos],
                    style: {}
                  }));
                }}
                className="mt-2"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Shop Details</h2>
            <div>
              <label className="block font-semibold text-gray-700">Shop Name</label>
              <FreeTextEditor
                value={shopDetails.shopName.content}
                onSave={(content: string, style: object) => handleShopContentSave("shopName", content, style)}
                placeholder="Enter shop name"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Shop Description</label>
              <FreeTextEditor
                value={shopDetails.shopDescription.content}
                onSave={(content: string, style: object) => handleShopContentSave("shopDescription", content, style)}
                placeholder="Enter shop description"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Shop Address</label>
              <FreeTextEditor
                value={shopDetails.shopAddress.content}
                onSave={(content: string, style: object) => handleShopContentSave("shopAddress", content, style)}
                placeholder="Enter shop address"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Shop Contact</label>
              <FreeTextEditor
                value={shopDetails.shopContact.content}
                onSave={(content: string, style: object) => handleShopContentSave("shopContact", content, style)}
                placeholder="Enter shop contact information"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Shop Email</label>
              <FreeTextEditor
                value={shopDetails.shopEmail.content}
                onSave={(content: string, style: object) => handleShopContentSave("shopEmail", content, style)}
                placeholder="Enter shop email"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Shop Images</label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                {shopDetails.shopImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image.url} alt={`Shop ${index + 1}`} className="w-full h-48 object-cover rounded" />
                    <button
                      onClick={() => {
                        const updatedImages = [...shopDetails.shopImages];
                        updatedImages.splice(index, 1);
                        dispatch(updateShopField({ field: "shopImages", content: updatedImages, style: {} }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const newImages = files.map(file => ({
                    url: URL.createObjectURL(file)
                  }));
                  dispatch(updateShopField({
                    field: "shopImages",
                    content: [...shopDetails.shopImages, ...newImages],
                    style: {}
                  }));
                }}
                className="mt-2"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">FAQs</h2>
            <div className="space-y-4">
              {faqList.map((faq, index) => (
                <div key={index} className="border rounded p-4">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
              <div className="space-y-2">
                <input
                  type="text"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="New Question"
                />
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="New Answer"
                />
                <button
                  onClick={addFaq}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add FAQ
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Social Media Templates</h2>
            <div className="space-y-4">
              {socialMediaTemplates.map((template, index) => (
                <div key={index} className="border rounded p-4">
                  <h3 className="font-semibold">{template.platform} - {template.templateName}</h3>
                  <p className="text-gray-600">{template.caption}</p>
                  {template.hashtags.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Hashtags: </span>
                      {template.hashtags.map((tag, i) => (
                        <span key={i} className="text-blue-500 mr-2">#{tag}</span>
                      ))}
                    </div>
                  )}
                  {template.hooks && template.hooks.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Hooks: </span>
                      {template.hooks.map((hook, i) => (
                        <span key={i} className="text-green-500 mr-2">{hook}</span>
                      ))}
                    </div>
                  )}
                  {template.callToAction && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Call to Action: </span>
                      <span className="text-purple-500">{template.callToAction}</span>
                    </div>
                  )}
                </div>
              ))}
              <div className="space-y-4 p-4 border rounded">
                <div>
                  <label className="block font-semibold text-gray-700">Platform</label>
                  <select
                    value={newTemplate.platform}
                    onChange={(e) => setNewTemplate({ ...newTemplate, platform: e.target.value as "Facebook" | "Instagram" | "TikTok" })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Template Type</label>
                  <select
                    value={newTemplate.templateName}
                    onChange={(e) => setNewTemplate({ ...newTemplate, templateName: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a template type</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Limited Time Offer">Limited Time Offer</option>
                    <option value="Flash Sale">Flash Sale</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Special Promotion">Special Promotion</option>
                    <option value="Holiday Special">Holiday Special</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Caption</label>
                  <textarea
                    value={newTemplate.caption}
                    onChange={(e) => setNewTemplate({ ...newTemplate, caption: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Write an engaging caption for your post..."
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Hashtags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newTemplate.hashtags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center">
                        #{tag}
                        <button
                          onClick={() => {
                            const updatedTags = [...newTemplate.hashtags];
                            updatedTags.splice(index, 1);
                            setNewTemplate({ ...newTemplate, hashtags: updatedTags });
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newTemplate.hashtags.join(' ')}
                    onChange={(e) => setNewTemplate({ ...newTemplate, hashtags: e.target.value.split(' ').filter(tag => tag) })}
                    className="w-full p-2 border rounded"
                    placeholder="Add hashtags (separate with spaces) e.g., #newarrival #limitedtime #exclusive"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Hooks</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newTemplate.hooks?.map((hook, index) => (
                      <span key={index} className="bg-green-100 text-green-600 px-2 py-1 rounded-full flex items-center">
                        {hook}
                        <button
                          onClick={() => {
                            const updatedHooks = [...(newTemplate.hooks || [])];
                            updatedHooks.splice(index, 1);
                            setNewTemplate({ ...newTemplate, hooks: updatedHooks });
                          }}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newTemplate.hooks?.join(' ') || ''}
                    onChange={(e) => setNewTemplate({ ...newTemplate, hooks: e.target.value.split(' ').filter(hook => hook) })}
                    className="w-full p-2 border rounded"
                    placeholder="Add hooks (separate with spaces) e.g., Limited Time Offer, Exclusive Deal, Flash Sale"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Call to Action</label>
                  <select
                    value={newTemplate.callToAction || ''}
                    onChange={(e) => setNewTemplate({ ...newTemplate, callToAction: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a call to action</option>
                    <option value="Shop Now">Shop Now</option>
                    <option value="Learn More">Learn More</option>
                    <option value="Get Yours Today">Get Yours Today</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Don't Miss Out">Don't Miss Out</option>
                    <option value="Grab Yours">Grab Yours</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">Default Image URL</label>
                  <input
                    type="text"
                    value={newTemplate.defaultImageUrl || ''}
                    onChange={(e) => setNewTemplate({ ...newTemplate, defaultImageUrl: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Enter URL for default image (used when no product image is available)"
                  />
                  {newTemplate.defaultImageUrl && (
                    <div className="mt-2">
                      <img src={newTemplate.defaultImageUrl} alt="Preview" className="max-h-40 rounded" />
                    </div>
                  )}
                </div>
                <button
                  onClick={addTemplate}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Template
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step
                  ? 'bg-blue-600 text-white'
                  : currentStep > step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {renderStep()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {currentStep === 4 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default StepForm; 