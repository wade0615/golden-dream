import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import SearchBar from 'components/searchBar/SearchBar';
import AdvanceSection from 'components/advanceSection/AdvanceSection';
import Form from 'react-bootstrap/Form';
import TextField from 'features/textField/TextField';
// import { DevTool } from '@hookform/devtools';

function AdvanceSearch({
  searchBarName = 'search',
  searchBarOptionsName = 'searchType',
  children,
  methods = null,
  onSubmit = (f) => f,
  onError = (f) => f,
  totalCount = null,
  placeholder = '請輸入些什麼',
  searchTypeOptions = []
}) {
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };
  if (!methods) {
    console.log('請使用 react-hook-form 的 useForm ');
    return null;
  }
  return (
    <>
      <FormProvider {...methods}>
        <Form noValidate onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <div>
            <div className='d-flex flex-md-row flex-column justify-content-end align-items-end gap-2 me-3'>
              <div className='order-md-3 order-1'>
                <SearchBar
                  placeholder={placeholder}
                  name={searchBarName}
                  isAdvanceSearchBtn={true}
                  isAdvanceOpen={open}
                  toggleOpen={handleToggle}
                />
              </div>
              <div className='order-md-1 order-2 d-flex justify-content-end align-items-center'>
                {totalCount !== null && (
                  <p className='mb-0 me-3' style={{ fontSize: '14px' }}>
                    搜尋結果 {totalCount} 筆
                  </p>
                )}
                {searchTypeOptions.length > 0 && (
                  <TextField
                    className='me-2'
                    variant='select'
                    name={searchBarOptionsName}
                    isPlaceholder={false}
                    options={searchTypeOptions}
                    fieldHeight='2.5rem'
                    fieldBorder='1px solid var(--bs-gray-400)'
                  />
                )}
              </div>
            </div>
            <AdvanceSection
              isOpen={open}
              onClose={() => setOpen(false)}
              onClear={() => methods.reset()}
            >
              {children}
            </AdvanceSection>
          </div>
        </Form>
      </FormProvider>
      {/* <DevTool control={methods.control} /> */}
    </>
  );
}

export default AdvanceSearch;
