import React from 'react';
import PropType from 'prop-types';
import { Formik, Field, FieldArray, Form } from 'formik';
import * as Yup from 'yup';
import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { ImageLoader } from '@/components/common';
import { CustomCreatableSelect, CustomInput, CustomTextarea } from '@/components/formik';
import { useFileHandler } from '@/hooks';

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required('Product name is required.')
    .max(60, 'Product name must be less than 60 characters.'),
  description: Yup.string().required('Description is required.'),
  maxQuantity: Yup.number()
    .positive('Max quantity is invalid.')
    .integer('Max quantity should be an integer.')
    .required('Max quantity is required.'),
  keywords: Yup.array()
    .of(Yup.string())
    .min(1, 'Please enter at least 1 keyword for this product.'),
  sizesWithPrices: Yup.array()
    .of(
      Yup.object().shape({
        size: Yup.string().required('Size is required.'),
        price: Yup.number().positive('Price is invalid.').required('Price is required.')
      })
    )
    .min(1, 'Please enter at least one size and price.'),
  isFeatured: Yup.boolean(),
  isRecommended: Yup.boolean(),
});

const ProductForm = ({ product, onSubmit, isLoading }) => {
  const initFormikValues = {
    name: product?.name || '',
    price: product?.price || 0,
    maxQuantity: product?.maxQuantity || 0,
    description: product?.description || '',
    keywords: product?.keywords || [],
    sizesWithPrices: product?.sizesWithPrices || [{ size: '', price: 0 }],
    isFeatured: product?.isFeatured || false,
    isRecommended: product?.isRecommended || false,
  };

  const { imageFile, isFileLoading, onFileChange, removeImage } = useFileHandler({
    image: {},
    imageCollection: product?.imageCollection || []
  });

  const onSubmitForm = (form) => {
    if (imageFile.image.file || product.imageUrl) {
      onSubmit({
        ...form,
        quantity: 1,
        name_lower: form.name.toLowerCase(),
        dateAdded: new Date().getTime(),
        image: imageFile?.image?.file || product.imageUrl,
        imageCollection: imageFile.imageCollection
      });
    } else {
      alert('Product thumbnail image is required.');
    }
  };

  return (
    <div>
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        onSubmit={onSubmitForm}
      >
        {({ values, setValues }) => (
          <Form className="product-form">
            <div className="product-form-inputs">
              <div className="d-flex-start">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="name"
                    type="text"
                    label="* Product Name"
                    component={CustomInput}
                  />
                </div>
                &nbsp;
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="description"
                    id="description"
                    rows={3}
                    label="* Product Description"
                    component={CustomTextarea}
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="price"
                    id="price"
                    type="number"
                    label="* Price"
                    component={CustomInput}
                  />
                </div>
                &nbsp;
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="maxQuantity"
                    type="number"
                    id="maxQuantity"
                    label="* Max Quantity"
                    component={CustomInput}
                  />
                </div>
              </div>
              <div className="d-flex">
               
                &nbsp;
                <div className="product-form-field">
                  <FieldArray name="sizesWithPrices">
                    {({ remove, push }) => (
                      <div>
                        <span className='d-block padding-s' >* Sizes and Prices</span>
                        {values.sizesWithPrices.map((sizeWithPrice, index) => (
                          <div key={index} className="d-flex">
                            <div className="product-form-field">
                              <Field
                                disabled={isLoading}
                                name={`sizesWithPrices.${index}.size`}
                                type="text"
                                label="Size"
                                component={CustomInput}
                              />
                            </div>
                            &nbsp;
                            <div className="product-form-field">
                              <Field
                                disabled={isLoading}
                                name={`sizesWithPrices.${index}.price`}
                                type="number"
                                label="Price"
                                component={CustomInput}
                              />
                            </div>
                            &nbsp;
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <h5
                          type="button"
                          disabled={isLoading}
                          onClick={() => push({ size: '', price: 0 })}
                          style={{ cursor: 'pointer', textDecoration: 'underline' }}
                          >
                          +Add Size and Price
                        
                        </h5>
                        <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={values.keywords.map((key) => ({ value: key, label: key }))}
                    name="keywords"
                    iid="keywords"
                    isMulti
                    disabled={isLoading}
                    placeholder="Create/Select Keywords"
                    label="* Keywords"
                  />
                </div>
                      </div>
                      
                    )}
                  </FieldArray>
                </div>
              </div>
              <div className="product-form-field">
                <span className="d-block padding-s">Image Collection</span>
                {!isFileLoading && (
                  <label htmlFor="product-input-file-collection">
                    <input
                      disabled={isLoading}
                      hidden
                      id="product-input-file-collection"
                      multiple
                      onChange={(e) => onFileChange(e, { name: 'imageCollection', type: 'multiple' })}
                      readOnly={isLoading}
                      type="file"
                    />
                    Choose Images
                  </label>
                )}
              </div>
              <div className="product-form-collection">
                {imageFile.imageCollection.length >= 1 &&
                  imageFile.imageCollection.map((image) => (
                    <div className="product-form-collection-image" key={image.id}>
                      <ImageLoader alt="" src={image.url} />
                      <button
                        className="product-form-delete-image"
                        onClick={() => removeImage({ id: image.id, name: 'imageCollection' })}
                        title="Delete Image"
                        type="button"
                      >
                        <i className="fa fa-times-circle" />
                      </button>
                    </div>
                  ))}
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <input
                    checked={values.isFeatured}
                    id="featured"
                    onChange={(e) => setValues({ ...values, isFeatured: e.target.checked })}
                    type="checkbox"
                  />
                  <label htmlFor="featured">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Add to Featured &nbsp;
                    </h5>
                  </label>
                </div>
                <div className="product-form-field">
                  <input
                    checked={values.isRecommended}
                    id="recommended"
                    onChange={(e) => setValues({ ...values, isRecommended: e.target.checked })}
                    type="checkbox"
                  />
                  <label htmlFor="recommended">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Add to Recommended &nbsp;
                    </h5>
                  </label>
                </div>
              </div>
              <div className="product-form-field product-form-submit">
                <button className="button" disabled={isLoading} type="submit">
                  {isLoading ? <LoadingOutlined /> : <CheckOutlined />}
                  &nbsp;
                  {isLoading ? 'Saving Product' : 'Save Product'}
                </button>
              </div>
            </div>
            <div className="product-form-file">
              <div className="product-form-field">
                <span className="d-block padding-s">* Thumbnail</span>
                {!isFileLoading && (
                  <label htmlFor="product-input-file">
                    <input
                      disabled={isLoading}
                      hidden
                      id="product-input-file"
                      onChange={(e) => onFileChange(e, { name: 'image', type: 'single' })}
                      readOnly={isLoading}
                      type="file"
                    />
                    Choose Image
                  </label>
                )}
              </div>
              <div className="product-form-image-wrapper">
                {(imageFile.image.url || product.image) && (
                  <ImageLoader alt="" className="product-form-image-preview" src={imageFile.image.url || product.image} />
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

ProductForm.PropType = {
  product: PropType.shape({
    name: PropType.string,
    price: PropType.number,
    maxQuantity: PropType.number,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    imageCollection: PropType.arrayOf(PropType.object),
    sizesWithPrices: PropType.arrayOf(
      PropType.shape({
        size: PropType.string.isRequired,
        price: PropType.number.isRequired,
      })
    ).isRequired,
    image: PropType.string,
    imageUrl: PropType.string,
    isFeatured: PropType.bool,
    isRecommended: PropType.bool,
  }).isRequired,
  onSubmit: PropType.func.isRequired,
  isLoading: PropType.bool.isRequired,
};

export default ProductForm;