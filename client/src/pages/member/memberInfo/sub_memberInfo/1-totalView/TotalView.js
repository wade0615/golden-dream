import { useEffect, useContext } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { MemberInfoContext } from '../../MemberInfo';

import { OverviewAnalysisClass } from 'formatClass/memberShip';
import api from 'services/api';
import ExceptionHandleService from 'utils/exceptionHandler';
import { insertComma } from 'utils/commonUtil';
import Info from '../0-component/Info';

import { TagChip } from 'components/chip';
import { genderOptions } from 'features/grouping/groupingConfig';
import { Form } from 'react-bootstrap';
import './TotalViewStyle.scss';

const _EHS = new ExceptionHandleService({
  _NAME: 'page/member/memberInfo/sub_memberInfo/1-totalView/TotalView.js',
  _NOTICE: ''
});

const _defaultValues = {
  memberCardId: '',
  birthday: '',
  gender: '',
  referralCode: '',
  tagNames: [],
  memberShipDate: '',
  registerDate: '',
  registerChannel: '',
  openChannel: '',
  completeAddress: '',
  email: '',
  memberShipDetail: [],
  pointDetail: [],
  consumptionDetail: [],
  consumptionBrand: [],
  consumptionCommodity: [],
  consumptionElectronicCoupon: []
};

/** 會員詳情 - 總覽分析 */
function TotalView() {
  const { commonData, memberId } = useContext(MemberInfoContext);

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: _defaultValues
  });

  /** 初始化 */
  useEffect(() => {
    try {
      const getInit = async () => {
        const [addrRes, res] = await Promise.all([
          api.common.getTownshipCityData(),
          api.member.getOverviewAnalysis({ memberId })
        ]);
        if (addrRes) {
          const formatCityCode = addrRes.map((code) => {
            return {
              value: code.cityCode,
              label: code.cityName
            };
          });
          const formatZipCode = addrRes.reduce((acc, cur) => {
            let zips = cur.zips.map((code) => {
              return {
                value: code.zipCode,
                label: code.zipName
              };
            });
            return { ...acc, [cur.cityCode]: zips };
          }, {});
          if (res) {
            const _overviewAnalysisClass = new OverviewAnalysisClass(
              res,
              genderOptions,
              formatCityCode,
              formatZipCode
            );
            methods.reset({
              ..._defaultValues,
              ..._overviewAnalysisClass
            });
          }
        }
      };
      if (memberId) getInit();
    } catch (error) {
      _EHS.errorReport(error, 'getInit', _EHS._LEVEL.ERROR);
    }
    // eslint-disable-next-line
  }, [memberId, methods]);

  const handleSubmit = () => {
    console.log('submit');
  };

  const MemberInfoRow = ({ title, content, className = '' }) => (
    <div className='info-row'>
      <div className='info-title'>{title}</div>
      <div className={className}>{content}</div>
    </div>
  );

  const DetailBillBoard = ({ data }) => {
    if (!data?.length) return;
    return (
      <div className='detailBillBoard'>
        {data.map((item, idx) => (
          <div key={idx} className='billBoard__item'>
            <p className='h4 text-info'>{insertComma(item.number)}</p>
            <p className='body text-nowrap'>{item?.text}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div id='log-list-c98283b4-c97b-4c9b-b026-4b8cd77640c9'>
      <FormProvider {...methods}>
        <div className='mx-4'>
          <Form noValidate onSubmit={methods.handleSubmit(handleSubmit)}>
            <div className='member-info-container'>
              <div className='info'>
                {/* 會員資訊區塊 */}
                <Info
                  name={commonData?.name}
                  mobile={`${commonData?.mobileCountryCode}-${commonData?.mobile}`}
                  chips={[
                    commonData?.membershipStatus,
                    commonData?.specialTypeName
                  ]}
                  newLine
                  noBorderBottom
                />
                <div className='chips pt-3'>
                  {methods.getValues('tagNames').map((chip, idx) => (
                    <TagChip
                      key={idx}
                      id={idx}
                      label={chip}
                      bgColor='var(--bs-primary)'
                      rounded
                      outline
                    />
                  ))}
                </div>
              </div>
              <div className='divider' />
              <div className='info'>
                <MemberInfoRow
                  title='會員卡號'
                  content={methods.getValues('memberCardId')}
                />
                <MemberInfoRow
                  title='生日'
                  content={methods.getValues('birthday')}
                />
                <MemberInfoRow
                  title='性別'
                  content={methods.getValues('gender')}
                />
                <MemberInfoRow
                  title='個人推薦碼'
                  content={methods.getValues('referralCode')}
                />
                <MemberInfoRow
                  title='會籍起訖'
                  content={methods.getValues('memberShipDate')}
                  className='text-nowrap'
                />
              </div>
              <div className='divider' />
              <div className='info'>
                <MemberInfoRow
                  title='註冊時間'
                  content={methods.getValues('registerDate')}
                />
                <MemberInfoRow
                  title='註冊渠道'
                  content={methods.getValues('registerChannel')}
                />
                <MemberInfoRow
                  title='開通渠道'
                  content={methods.getValues('openChannel')}
                />
                <MemberInfoRow
                  title='居住地'
                  content={methods.getValues('completeAddress')}
                />
                <MemberInfoRow
                  title='電子信箱'
                  content={methods.getValues('email')}
                />
              </div>
            </div>
            <div className='detail-container'>
              <div className='detail-block'>
                <DetailBillBoard data={methods.getValues('memberShipDetail')} />
              </div>
              <div className='detail-block'>
                <DetailBillBoard data={methods.getValues('pointDetail')} />
              </div>
              <div className='detail-block'>
                <DetailBillBoard
                  data={methods.getValues('consumptionDetail')}
                />
              </div>
            </div>
            <div className='consumption-container'>
              <div className='consumption-block'>
                <div className='consumption-title'>最常消費品牌</div>
                <div className='consumption-table'>
                  {methods.getValues('consumptionBrand').length ? (
                    <>
                      <div className='consumption-table-header'>
                        <div>品牌</div>
                        <div>次數</div>
                        <div>最近消費日</div>
                      </div>
                      {methods
                        .getValues('consumptionBrand')
                        .map((brand, index) => (
                          <div key={index} className='consumption-table-row'>
                            <div>{brand.brandName}</div>
                            <div>{brand.brandCount}</div>
                            <div>{brand.consumptionDate}</div>
                          </div>
                        ))}
                    </>
                  ) : (
                    <div className='consumption-table-no-record'>
                      無相關紀錄
                    </div>
                  )}
                </div>
              </div>
              <div className='consumption-block'>
                <div className='consumption-title'>最常消費菜色</div>
                <div className='consumption-table'>
                  {methods.getValues('consumptionCommodity').length ? (
                    <>
                      <div className='consumption-table-header'>
                        <div>商品</div>
                        <div>次數</div>
                        <div>最近消費日</div>
                      </div>
                      {methods
                        .getValues('consumptionCommodity')
                        .map((brand, index) => (
                          <div key={index} className='consumption-table-row'>
                            <div>{brand.commodityName}</div>
                            <div>{brand.commodityCount}</div>
                            <div>{brand.consumptionDate}</div>
                          </div>
                        ))}
                    </>
                  ) : (
                    <div className='consumption-table-no-record'>
                      無相關紀錄
                    </div>
                  )}
                </div>
              </div>
              <div className='consumption-block'>
                <div className='consumption-title'>最常購買票券</div>
                <div className='consumption-table'>
                  {methods.getValues('consumptionElectronicCoupon').length ? (
                    <>
                      <div className='consumption-table-header'>
                        <div>票券</div>
                        <div>次數</div>
                        <div>最近消費日</div>
                      </div>
                      {methods
                        .getValues('consumptionElectronicCoupon')
                        .map((brand, index) => (
                          <div key={index} className='consumption-table-row'>
                            <div>{brand.electronicCouponName}</div>
                            <div>{brand.electronicCouponCount}</div>
                            <div>{brand.consumptionDate}</div>
                          </div>
                        ))}
                    </>
                  ) : (
                    <div className='consumption-table-no-record'>
                      無相關紀錄
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </div>
      </FormProvider>
    </div>
  );
}

export default TotalView;
