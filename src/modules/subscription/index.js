import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import Breadcrumb from "modules/slider/components/Breadcrumb";

import {
  getSubscriptionProductList,
  getActiveSubscriptionsBySite,
} from "store/actions";
import CommonButton from "components/CommonButton";
// import { SubscriptionLoader } from "common/Loaders/Loader"
// import CustomButton from "common/CustomButton"
//import Loader from "components/Loader";
import { isDisabled } from "@testing-library/user-event/dist/utils";
const Subscription = () => {
  const { subscriptionProduct, activeSubscriptionsList, loading } = useSelector(
    state => state.Subscription
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getSubscriptionProductList({
        site_id: +process.env.REACT_APP_SITE_ID,
        category_id: 0,
      })
    );
    dispatch(
      getActiveSubscriptionsBySite({
        site_id: process.env.REACT_APP_SITE_ID,
      })
    );
  }, [dispatch]);

  const handleSubscription = () => {
    toast.error(
      "You are already having one active subscription. Please cancel that and try again."
    );
  };

  const aSIds = useMemo(
    () =>
      !!activeSubscriptionsList && activeSubscriptionsList?.length
        ? activeSubscriptionsList.map(el => {
            const products = [];
            if (!!el.user_orders && el.user_orders?.length)
              el.user_orders.forEach(childEl => {
                childEl.user_order_items.forEach(i => {
                  products.push(i.product_id);
                });
              });
            return {
              next_payment_date: el.next_payment_date,
              user_subscription_id: el.user_subscription_id,
              products,
            };
          })
        : [],
    [activeSubscriptionsList]
  );

  return (
    <div className="right_bar">
      <Breadcrumb />
      <h1 className="hello_title">Subscription</h1>
      <div className="right-main-card main-card">
        <div className="container-fluid">
          {loading ? (
            <section>
              {" "}
              {/* <Loader withFullscreen={false} />{" "} */}
            </section>
          ) : (
            <div className="right-main-card main-card">
              {/* mt-4 */}
              <div className="row">
                {/* <div className="d-flex flex-wrap subscription_card_main"> */}
                {subscriptionProduct?.map((item, i) => {
                  return (
                    <div className="col-md-6 col-sm-6 col-lg-6 pb-4">
                      <div className="card">
                        {/* mx-3 */}
                        <div className="card-body p-5">
                          <div className="subscription-main-wrapper">
                            <React.Fragment key={i}>
                              {!!aSIds.find(el =>
                                el.products.includes(item.product_id)
                              )?.next_payment_date && (
                                <div className="date-renewal mt-3">
                                  {/* p-2 */}
                                  Next renewal :{" "}
                                  {moment(
                                    aSIds.find(el =>
                                      el.products.includes(item.product_id)
                                    )?.next_payment_date
                                  ).format("MMMM DD,yyyy")}
                                </div>
                              )}
                              <div
                                className={`c-subscription d-flex flex-column gap-3 ${
                                  !!aSIds.find(el =>
                                    el.products.includes(item.product_id)
                                  )?.next_payment_date
                                    ? "mt-0"
                                    : "mt-3"
                                }`}
                              >
                                <div className="c-subscription-main-left">
                                  {/* p-2 */}
                                  <div
                                    className={`c-subs-extra ${
                                      item.product_duration === 30
                                        ? "sub-color-3"
                                        : item.product_duration === 365 &&
                                          "sub-color-1"
                                    }`}
                                  >
                                    {/* <img src={markImg} alt="label icon" /> */}
                                  </div>
                                  <div className="c-subs-title">
                                    <h2>
                                      {/* {item.product_name} */}
                                      {item.product_name === "Hub Monthly"
                                        ? "Monthly Subscription"
                                        : item.product_name === "Hub Yearly"
                                        ? "Yearly Subscription"
                                        : item.product_name}
                                    </h2>
                                  </div>
                                </div>
                                <div className="c-subscription-main-right d-flex flex-column gap-3">
                                  <div className="c-vline"></div>
                                  <div className="c-subs-monthly">
                                    {/* p-2 */}
                                    {item.product_duration <= 31 && (
                                      <h5>
                                        ${item?.product_price || 0}{" "}
                                        <small>
                                          <strong>/ Monthly</strong>
                                        </small>
                                      </h5>
                                    )}
                                    {item.product_duration < 365 &&
                                      item.product_duration > 31  && (
                                        <h5>
                                          ${item?.product_price || 0}{" "}
                                          <small>
                                            <strong>/ Quarterly</strong>
                                          </small>
                                        </h5>
                                      )}
                                    {item.product_duration === 365 && (
                                      <>
                                        <h5>
                                          ${item?.product_price || 0}{" "}
                                          <small>
                                            <strong>/ Yearly</strong>
                                          </small>
                                        </h5>
                                      </>
                                    )}
                                  </div>
                                  <div className="c-vline"></div>
                                  <div className="c-subs-yearly">
                                    {/* p-2 */}
                                    <div className="c-sub-btn c-flex-center">
                                      {!!aSIds.find(el =>
                                        el.products.includes(item.product_id)
                                      ) ? (
                                        <>
                                          <Link
                                            target="_parent"
                                            to={
                                              process.env
                                                .REACT_APP_ACCOUNT_SITE_URL +
                                              "view-subscription/" +
                                              aSIds.find(el =>
                                                el.products.includes(
                                                  item.product_id
                                                )
                                              )?.user_subscription_id
                                            }
                                          >
                                            <CommonButton
                                              btnText={`Try ${
                                                item.product_name === "Monthly"
                                                  ? "Monthly "
                                                  : item.product_name ===
                                                    "Yearly"
                                                  ? "Yearly "
                                                  : item.product_name
                                              } Subscription`}
                                            />
                                          </Link>
                                        </>
                                      ) : activeSubscriptionsList?.filter(
                                          site =>
                                            site.site_id ===
                                            +process.env.REACT_APP_SITE_ID
                                        )?.length > 0 ? (
                                        <div
                                          onClick={handleSubscription}
                                          className="cursor-pointer"
                                          style={{ maxWidth: "180px" }}
                                        >
                                          <CommonButton
                                            btnDisabled={isDisabled}
                                            btnText={`Try ${
                                              item.product_name ===
                                              "Hub Monthly"
                                                ? "Monthly "
                                                : item.product_name ===
                                                  "Hub Yearly"
                                                ? "Yearly "
                                                : item.product_name
                                            } Subscription`}
                                          />
                                        </div>
                                      ) : (
                                        <>
                                          <Link
                                            target="_parent"
                                            to={
                                              process.env
                                                .REACT_APP_ACCOUNT_SITE_URL +
                                              "subscription-confirmation?product_id=" +
                                              item.product_id +
                                              "&site_id=" +
                                              item?.site_id +
                                              "&redirect_url=" +
                                              process.env
                                                .REACT_APP_SLIDR_REDIRECT_SITE_URL
                                              
                                            }
                                          >
                                            <CommonButton
                                              btnText={`Try ${
                                                item.product_name ===
                                                "Hub Monthly"
                                                  ? "Monthly "
                                                  : item.product_name ===
                                                    "Hub Yearly"
                                                  ? "Yearly "
                                                  : item.product_name
                                              } Subscription`}
                                            />
                                          </Link>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
