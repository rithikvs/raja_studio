import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, CheckCircle, Calendar, Phone, Mail, User, Sparkles, AlertCircle } from 'lucide-react';
import styles from './ServiceEnquiryModal.module.css';

const STUDIO_WHATSAPP = '917708552461';

const ServiceEnquiryModal = ({ isOpen, onClose, selectedService }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');
    
    // Service-specific custom fields
    const [laptopIssue, setLaptopIssue] = useState('');
    const [materialSpec, setMaterialSpec] = useState('');
    const [quantity, setQuantity] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [streamPlatform, setStreamPlatform] = useState('YouTube Live');

    const [isSubmitted, setIsSubmitted] = useState(false);

    // Reset when modal opens/closes or service changes
    useEffect(() => {
        if (isOpen) {
            setIsSubmitted(false);
        }
    }, [isOpen, selectedService]);

    if (!isOpen) return null;

    const serviceTitle = selectedService?.title || selectedService?.name || 'Custom Studio Service';
    const enquiryType = selectedService?.enquiryType || 'general';

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    const handleWhatsAppEnquiry = () => {
        let msg = `*New Service Enquiry — Raja Studios*\n\n`;
        msg += `📌 *Service:* ${serviceTitle}\n`;
        if (name) msg += `👤 *Name:* ${name}\n`;
        if (phone) msg += `📞 *Phone:* ${phone}\n`;
        
        if (enquiryType === 'laptop' && laptopIssue) {
            msg += `💻 *Laptop Issue Description:* ${laptopIssue}\n`;
        }
        if (enquiryType === 'printing') {
            if (materialSpec) msg += `🎨 *Material / Substrate:* ${materialSpec}\n`;
            if (quantity) msg += `📦 *Approx. Quantity:* ${quantity}\n`;
        }
        if (enquiryType === 'photography') {
            if (eventDate) msg += `📅 *Event Date:* ${eventDate}\n`;
            if (eventLocation) msg += `📍 *Venue / Location:* ${eventLocation}\n`;
        }
        if (enquiryType === 'streaming') {
            if (eventDate) msg += `📅 *Live Stream Date:* ${eventDate}\n`;
            if (streamPlatform) msg += `📺 *Platform:* ${streamPlatform}\n`;
        }
        if (notes) msg += `📝 *Notes:* ${notes}\n`;

        const encoded = encodeURIComponent(msg);
        window.open(`https://wa.me/${STUDIO_WHATSAPP}?text=${encoded}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 320 }}
                className={styles.modalDialog}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div>
                        <span className={styles.headerEyebrow}>BESPOKE SERVICE ENQUIRY</span>
                        <h3 className={styles.modalTitle}>{serviceTitle}</h3>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className={styles.closeBtn}
                        aria-label="Close enquiry modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {isSubmitted ? (
                    /* Submission Success State */
                    <div className={styles.successState}>
                        <div className={styles.successIconWrapper}>
                            <CheckCircle size={48} className={styles.successIcon} />
                        </div>
                        <h4>Thank You, {name || 'Valued Customer'}!</h4>
                        <p>Your enquiry for <strong>{serviceTitle}</strong> has been received. Our studio manager will reach out via WhatsApp / phone shortly with a custom estimate.</p>
                        
                        <div className={styles.successCtaRow}>
                            <button 
                                type="button" 
                                onClick={handleWhatsAppEnquiry}
                                className={styles.whatsAppSuccessBtn}
                            >
                                <MessageSquare size={18} />
                                <span>Speed Up via WhatsApp</span>
                            </button>
                            <button 
                                type="button" 
                                onClick={onClose}
                                className={styles.doneBtn}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Enquiry Form */
                    <form onSubmit={handleFormSubmit} className={styles.enquiryForm}>
                        <div className={styles.formGrid}>
                            {/* Full Name */}
                            <div className={styles.inputGroup}>
                                <label><User size={14} /> Your Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            {/* Phone / WhatsApp */}
                            <div className={styles.inputGroup}>
                                <label><Phone size={14} /> Phone / WhatsApp Number *</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="+91 98765 43210"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </div>

                            {/* Email */}
                            <div className={styles.inputGroupFull}>
                                <label><Mail size={14} /> Email Address (Optional)</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Contextual Fields: Laptop Repair */}
                            {enquiryType === 'laptop' && (
                                <div className={styles.inputGroupFull}>
                                    <label>Laptop Brand, Model &amp; Issue Description *</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="e.g. Dell Inspiron 15, screen flickering, overheating after 15 mins..."
                                        value={laptopIssue}
                                        onChange={e => setLaptopIssue(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Contextual Fields: UV or Laser Printing */}
                            {enquiryType === 'printing' && (
                                <>
                                    <div className={styles.inputGroup}>
                                        <label>Desired Material / Substrate</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Acrylic, Wood, Canvas"
                                            value={materialSpec}
                                            onChange={e => setMaterialSpec(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Estimated Quantity</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 1 sample, 50 units"
                                            value={quantity}
                                            onChange={e => setQuantity(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Contextual Fields: Photography / Wedding */}
                            {enquiryType === 'photography' && (
                                <>
                                    <div className={styles.inputGroup}>
                                        <label><Calendar size={14} /> Expected Event Date</label>
                                        <input
                                            type="date"
                                            value={eventDate}
                                            onChange={e => setEventDate(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Event Venue / City</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Madurai, Trichy, Chennai"
                                            value={eventLocation}
                                            onChange={e => setEventLocation(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Contextual Fields: Live Streaming */}
                            {enquiryType === 'streaming' && (
                                <>
                                    <div className={styles.inputGroup}>
                                        <label><Calendar size={14} /> Broadcast Date</label>
                                        <input
                                            type="date"
                                            value={eventDate}
                                            onChange={e => setEventDate(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Target Platform</label>
                                        <select 
                                            value={streamPlatform} 
                                            onChange={e => setStreamPlatform(e.target.value)}
                                        >
                                            <option value="YouTube Live">YouTube Live (Recommended)</option>
                                            <option value="Facebook Live">Facebook Live</option>
                                            <option value="Private RTMP Stream">Private / Custom Stream</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Additional Requirements */}
                            <div className={styles.inputGroupFull}>
                                <label>Additional Notes / Specifications</label>
                                <textarea
                                    rows={2}
                                    placeholder="Tell us any specific requirements or deadlines..."
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className={styles.actionRow}>
                            <button type="submit" className={styles.submitBtn}>
                                <Send size={16} />
                                <span>Submit Service Enquiry</span>
                            </button>

                            <button 
                                type="button" 
                                onClick={handleWhatsAppEnquiry}
                                className={styles.whatsAppQuickBtn}
                                title="Chat directly with our studio manager on WhatsApp"
                            >
                                <MessageSquare size={16} />
                                <span>Quick WhatsApp</span>
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ServiceEnquiryModal;
